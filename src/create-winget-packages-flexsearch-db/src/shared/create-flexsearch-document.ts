import FlexSearch, { Document, Charset } from 'flexsearch';
import type { WingetPackage } from './winget-package.ts';

export type DatabaseIndexFile = {
  creationDate: string;
  index: Record<string, string>;
};

export type FlexSearchDocumentData = {
  packageIdentifier: string;
  packageName: string;
  data: WingetPackage;
};

export function createFlexsearchDocument(): Document<FlexSearchDocumentData> {
  return new FlexSearch.Document({
    tokenize: 'forward',
    encoder: Charset.Exact,
    document: {
      id: 'packageIdentifier',
      index: ['packageIdentifier', 'packageName'],
      store: ['packageIdentifier', 'packageName', 'data'],
    },
  });
}
