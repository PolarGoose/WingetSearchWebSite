import type { WingetPackage } from '../../create-winget-packages-sqlite-db/src/shared/winget-package.ts';
import sqlite3InitModule from '@sqlite.org/sqlite-wasm';
import wingetPackagesSqliteDbUrl from './WingetPackages.sqlite3?url';

// Load sqlite wasm
const sqlite3WasmModule = await sqlite3InitModule();

// Create empty sqlite in-memory database
const wingetPackagesSqliteDb = new sqlite3WasmModule.oo1.DB();

// Deserialize the WingetPackages.sqlite3 database into the in-memory database
const bytes = new Uint8Array(await (await fetch(wingetPackagesSqliteDbUrl)).arrayBuffer());
wingetPackagesSqliteDb.checkRc(
  sqlite3WasmModule.capi.sqlite3_deserialize(
    wingetPackagesSqliteDb.pointer!,
    'main',
    sqlite3WasmModule.wasm.allocFromTypedArray(bytes),
    bytes.byteLength,
    bytes.byteLength,
    sqlite3WasmModule.capi.SQLITE_DESERIALIZE_FREEONCLOSE | sqlite3WasmModule.capi.SQLITE_DESERIALIZE_READONLY,
  ),
);

// Read creation time from Metadata
const metadataRows: Array<{ Value: string }> = [];
wingetPackagesSqliteDb.exec({
  sql: `SELECT Value FROM Metadata WHERE Key = 'CreationTime' LIMIT 1;`,
  rowMode: 'object',
  resultRows: metadataRows,
});
export const wingetPackagesSqliteDbCreationDate: Date = new Date(metadataRows[0]?.Value);

export function search(query: string, limit?: number): WingetPackage[] {
  const trimmed = query.trim();
  if (trimmed.length < 3) return [];

  const matchQuery = buildMatchQuery(trimmed);
  const useLimit = limit !== undefined;

  const rows: Array<{ Data: string }> = [];
  wingetPackagesSqliteDb.exec({
    sql: `SELECT Data
          FROM WingetPackages
          WHERE WingetPackages MATCH $matchQuery
          ORDER BY PackageIdentifier
          ${useLimit ? 'LIMIT $limit' : ''};`,
    bind: {
      $matchQuery: matchQuery,
      ...(useLimit ? { $limit: limit } : {}),
    },
    rowMode: 'object',
    resultRows: rows,
  });

  return rows.map((r) => JSON.parse(r.Data) as WingetPackage);
}

function buildMatchQuery(partOfIdOrName: string): string {
  const q = toFts5QuotedString(partOfIdOrName);
  return `(PackageIdentifier : ${q} OR PackageName : ${q})`;
}

function toFts5QuotedString(text: string): string {
  return `"${text.replace(/"/g, '""')}"`;
}
