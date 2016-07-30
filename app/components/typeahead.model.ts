/// <reference path="../../typings/tsd.d.ts" />

import * as React from 'react';

export interface ITypeaheadItem {
  label: string;
  value: any;
}

export interface IItemMapable {
  labelMap?: (item: any) => string;
}

export interface ISourceTypeCallback<Item>{
  (query: string): Promise<Item[]>;
}



interface IItemProp<T> {
  item: T;
}

interface IItemRender<T> {
  (item: T): React.ReactElement<IItemProp<T>>;
}

export interface IItemRenderable<T> {
  itemRender?: IItemRender<T>;
}

export type ISourceTypes<Item> = ISourceTypeCallback<Item> | Item[];


export interface ITypeaheadMatcher<T> {
  (query: string, items: T[]) : T[]
}