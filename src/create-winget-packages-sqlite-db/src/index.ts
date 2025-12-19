import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { cloneRepositoryShallow } from './git-executable.ts';
import { getWingetPackages } from './winget-git-repo.ts';
import { createWingetPackagesSqliteDatabase } from './create-winget-sqlite-db.ts';

async function main(): Promise<void> {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const buildDir = path.resolve(path.join(currentDir, '..', '..', '..', 'build'));

  const sqliteDbFilePath = path.join(currentDir, '..', '..', 'web-site', 'src', 'WingetPackages.sqlite3');
  const wingetGitRepoDir = path.join(buildDir, 'winget-pkgs');

  if (!existsSync(wingetGitRepoDir)) {
    console.log('Clone winget repo');
    await cloneRepositoryShallow('https://github.com/microsoft/winget-pkgs.git', wingetGitRepoDir);
  }

  console.log('Get all packages from the winget repo');
  const wingetPackages = await getWingetPackages(wingetGitRepoDir);

  console.log(`Create sqlite database '${sqliteDbFilePath}' with ${wingetPackages.length} packages`);
  createWingetPackagesSqliteDatabase(wingetPackages, sqliteDbFilePath);

  console.log('Success');
}

void main();
