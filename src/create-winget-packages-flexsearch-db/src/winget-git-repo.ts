import path from 'node:path';
import fs from 'node:fs/promises';
import fg from 'fast-glob';
import YAML from 'yaml';
import type { WingetPackage } from './shared/winget-package.ts';

export async function getWingetPackages(wingetGitRepositoryFolderPath: string): Promise<WingetPackage[]> {
  const manifestsPath = path.join(wingetGitRepositoryFolderPath, 'manifests');
  const prefixes = await getLatestVersionManifestPrefixes(manifestsPath);

  const packages: WingetPackage[] = [];

  for (const prefix of prefixes) {
    const mainManifest = await deserializeYaml(`${prefix}.yaml`);
    const defaultLocaleManifest = await deserializeYaml(`${prefix}.locale.${mainManifest.DefaultLocale}.yaml`);
    const installerManifest = await deserializeYaml(`${prefix}.installer.yaml`);

    packages.push({
      PackageIdentifier: mainManifest.PackageIdentifier,
      PackageVersion: mainManifest.PackageVersion,
      PackageName: defaultLocaleManifest.PackageName,
      ShortDescription: defaultLocaleManifest.ShortDescription,
      Description: defaultLocaleManifest.Description,
      Tags: uniqueStrings(defaultLocaleManifest.Tags),
      PackageUrl: defaultLocaleManifest.PackageUrl,
      SupportedArchitecture: uniqueStrings(installerManifest.Installers.map((ins: any) => ins.Architecture)),
    });
  }

  return packages;
}

// Returns the list of main manifest file paths without the ".yaml" extension for the latest version of every package. For example:
//   "C:\winget-pkgs\manifests\z\zxch3n\PomodoroLogger\0.6.3\zxch3n.PomodoroLogger"
//   "C:\winget-pkgs\manifests\w\WinMerge\WinMerge\2.16.6\WinMerge.WinMerge"
async function getLatestVersionManifestPrefixes(manifestsPath: string): Promise<string[]> {
  const files = await fg(['**/*.yaml'], { cwd: manifestsPath, absolute: true, onlyFiles: true });

  const latestByPackageId = new Map<string /* packageId */, { version: string; prefix: string }>();

  for (const filePath of files) {
    if (filePath.endsWith('.installer.yaml') || filePath.includes('.locale.')) {
      continue;
    }

    const directoryPath = path.dirname(filePath);
    const version = path.basename(directoryPath);
    const packageId = path.basename(filePath, '.yaml');
    const prefix = path.join(directoryPath, packageId);

    const existing = latestByPackageId.get(packageId);
    if (!existing || naturalVersionCompare(existing.version, version) < 0) {
      latestByPackageId.set(packageId, { version, prefix });
    }
  }

  return Array.from(latestByPackageId.values(), (v) => v.prefix);
}

async function deserializeYaml(yamlFilePath: string): Promise<any> {
  const text = await fs.readFile(yamlFilePath, 'utf8');
  return YAML.parse(text);
}

function naturalVersionCompare(a: string, b: string): number {
  const collator = new Intl.Collator('en', {
    numeric: true,
    sensitivity: 'variant',
    usage: 'sort',
  });
  return collator.compare(a, b);
}

function uniqueStrings(arr: readonly string[] | null): string[] {
  return arr ? Array.from(new Set(arr.filter(Boolean))) : [];
}
