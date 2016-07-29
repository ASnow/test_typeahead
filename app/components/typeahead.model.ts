export interface ITypeaheadItem {
  label: string;
  value: any;
}

export interface ISourceTypeCallback<Item>{
  (query: string): Promise<Item[]>;
}

export type ISourceTypes<Item> = ISourceTypeCallback<Item> | Item[];


export interface ITypeaheadMatcher<T> {
  (query: string, items: T[]) : T[]
}