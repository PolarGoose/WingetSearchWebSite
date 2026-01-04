import type { WingetPackage } from '../../create-winget-packages-flexsearch-db/src/shared/winget-package.ts';
import { createFlexsearchDocument, type DatabaseIndexFile } from '../../create-winget-packages-flexsearch-db/src/shared/create-flexsearch-document.ts';
import wingetFlexSearchDbRaw from '../../create-winget-packages-flexsearch-db/src/shared/winget-packages-flexsearch-db-index.json';
import type { Id } from 'flexsearch';

const wingetFlexSearchDb = wingetFlexSearchDbRaw as DatabaseIndexFile;
export const flexSearchDatabaseCreationDate = new Date(wingetFlexSearchDb.creationDate);

const index = createFlexsearchDocument();

for (const [key, data] of Object.entries(wingetFlexSearchDb.index)) {
  index.import(key, data);
}

export function search(query: string, limit?: number): WingetPackage[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const enriched = index.search(q, { enrich: true, limit: limit });

  const uniquePackages = new Map<Id, WingetPackage>();
  for (const fieldRes of enriched) {
    for (const hit of fieldRes.result) {
      uniquePackages.set(hit.id, hit.doc!.data);
    }
  }

  return Array.from(uniquePackages.values()).slice(0, limit);
}
