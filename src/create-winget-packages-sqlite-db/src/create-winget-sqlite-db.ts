import fs from 'node:fs';
import Database from 'better-sqlite3';
import type { WingetPackage } from './shared/winget-package.ts';

export function createWingetPackagesSqliteDatabase(packages: readonly WingetPackage[], sqliteDbFilePath: string) {
  if (fs.existsSync(sqliteDbFilePath)) {
    fs.unlinkSync(sqliteDbFilePath);
  }

  const db = new Database(sqliteDbFilePath);

  try {
    // Insert winget packages
    db.exec(`
      CREATE VIRTUAL TABLE WingetPackages USING fts5(PackageIdentifier,
                                                     PackageName,
                                                     Data UNINDEXED,
                                                     tokenize = 'trigram');`);
    const insert = db.prepare(`
      INSERT INTO WingetPackages (PackageIdentifier, PackageName, Data)
      VALUES (?, ?, ?);`);
    for (const pkg of packages) {
      insert.run(pkg.PackageIdentifier, pkg.PackageName, JSON.stringify(pkg));
    }

    // Insert creation time
    db.exec(`CREATE TABLE Metadata (Key TEXT PRIMARY KEY, Value TEXT);`);
    const insertMetadata = db.prepare(`INSERT INTO Metadata (Key, Value) VALUES (?, ?);`);
    insertMetadata.run('CreationTime', new Date().toISOString());

    // Optimize the database
    db.exec(`INSERT INTO WingetPackages(WingetPackages) VALUES('optimize');`);
    db.exec('VACUUM;');
  } finally {
    db.close();
  }
}
