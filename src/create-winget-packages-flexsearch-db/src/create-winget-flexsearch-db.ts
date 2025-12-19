import type { WingetPackage } from './shared/winget-package.ts';
import { createFlexsearchDocument } from './shared/create-flexsearch-document.ts';
import type { DatabaseIndexFile } from './shared/create-flexsearch-document.ts';
import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';

export async function createDatabase(packages: readonly WingetPackage[], outputJsonPath: string): Promise<void> {
  if (existsSync(outputJsonPath)) {
    await fs.unlink(outputJsonPath);
  }

  const index = createFlexsearchDocument();

  for (const pkg of packages) {
    index.add({
      packageIdentifier: pkg.PackageIdentifier.toLowerCase(),
      packageName: pkg.PackageName.toLowerCase(),
      data: pkg,
    });
  }

  const dump: Record<string, string> = {};
  index.export((key: string, data: string) => {
    dump[key] = data;
  });

  await fs.writeFile(
    outputJsonPath,
    JSON.stringify({
      creationDate: new Date().toISOString(),
      index: dump,
    } as DatabaseIndexFile),
    'utf8',
  );
}
