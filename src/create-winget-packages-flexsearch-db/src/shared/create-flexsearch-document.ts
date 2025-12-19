import FlexSearch, { Document, Charset } from 'flexsearch';

export type DatabaseIndexFile = {
  creationDate: string;
  index: Record<string, string>;
};

export function createFlexsearchDocument(): Document<any> {
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
