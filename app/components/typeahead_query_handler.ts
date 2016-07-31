/// <reference path="../../typings/tsd.d.ts" />

import { Typeahead, ITypeaheadProps } from './typeahead';
import { ISourceTypeCallback, ITypeaheadMatcher } from './typeahead.model';

type IResolve<T> = (list: T[]) => void;
interface ISearchCommand<T> {
  run(query: string): void;
}
interface ISearchCommandClass<T> {
  new(handler: TypeaheadQueryHandler<T>, resolve: IResolve<T> ): ISearchCommand<T>;
}

abstract class SearchCommand<Item> implements ISearchCommand<Item> {
  protected source: any;
  protected handler: TypeaheadQueryHandler<Item>;
  protected resolve: IResolve<Item>;

  constructor(handler: TypeaheadQueryHandler<Item>, resolve: IResolve<Item>) {
    this.handler = handler;
    this.source = handler.props.source;
    this.resolve = resolve;
  }
  public abstract run(query: string): void;
}

class PromiseSearch<Item> extends SearchCommand<Item> {
  protected source: ISourceTypeCallback<Item>;
  constructor(handler: TypeaheadQueryHandler<Item>, resolve: IResolve<Item>) {
    super(handler, resolve);
  }
  public run(query: string): void {
    this.source(query).then((list) => {
      this.resolve(list);
    });
  }
}

class ListSearch<Item> extends SearchCommand<Item> {
  protected source: Item[];
  constructor(handler: TypeaheadQueryHandler<Item>, resolve: IResolve<Item>) {
    super(handler, resolve);
  }

  protected defaultMatcher(query: string, items: Item[]): Item[] {
    return items.filter((item: any) => { return this.handler.label(item).indexOf(query) > -1; });
  }

  public run(query: string): void {
    const matcher: ITypeaheadMatcher<Item>  = this.handler.props.matcher || this.defaultMatcher;
    const list: Item[] = matcher(query, this.source);
    this.resolve(list);
  }
}

export class TypeaheadQueryHandler<Item> {
  protected object: Typeahead<Item>;
  protected search: ISearchCommand<Item>;
  constructor(object: Typeahead<Item>, props: ITypeaheadProps<Item>) {
    this.object = object;
    const searchClass: ISearchCommandClass<Item> = (props.source instanceof Array) ? ListSearch : PromiseSearch;
    this.search = new searchClass(this, (list) => this.setList(list));
  }

  get props(): ITypeaheadProps<Item> {
    return this.object.props;
  }

  protected setList(list: Item[]): void {
    this.object.setState({list});
  }

  public label(item: Item): string {
    return this.object.label(item);
  }

  protected cleanValue(): void {
    if (this.object.state.selected) { this.object.changeSelected(null); };
  }

  public run = (query: string) => {
    this.cleanValue();
    if (this.props.minLength > query.length) { this.setList([]); return; }
    this.search.run(query);
  }
}
