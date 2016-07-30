/// <reference path="../../typings/tsd.d.ts" />

import * as React from 'react';
import { TypeaheadQuery } from './typeahead_query';
import { TypeaheadList } from './typeahead_list';
import { ISourceTypes, ISourceTypeCallback, ITypeaheadMatcher, IItemRenderable, IItemMapable } from './typeahead.model';

interface ITypeaheadProps<Item> extends IItemRenderable<Item>, IItemMapable {
  source?: ISourceTypes<Item>;
  minLength?: number;
  matcher?: ITypeaheadMatcher<Item>;
  onChange?: (item: any) => void;
}

interface ITypeaheadState<Item> {
  selected?: Item;
  list?: Item[];
}

export class Typeahead<Item> extends React.Component<ITypeaheadProps<Item>, ITypeaheadState<Item>> {
  public label: (item: Item) => string;
  protected localList: Item[] = null;
  protected defaultMatcher: (query: string, items: Item[]) => Item[];

  public static defaultMathcer(query: string, items: any[]): any[] {
    return items.filter((item: any) => { return (this as any).label(item).indexOf(query) > -1; });
  }
  public static defaultLabelMap(item: any): string {
    return item.label;
  }
  public static defaultRenderer(item: any): any {
    return (
      <a>
        {item.label}
      </a>
    );
  }

  constructor(props: ITypeaheadProps<Item>, context: any) {
    super(props, context);
    if (props.source instanceof Array) {
      this.localList = props.source as Item[];
    }
    this.state = {};
    this.label = props.labelMap || Typeahead.defaultLabelMap;
    this.defaultMatcher = Typeahead.defaultMathcer.bind(this);
  }

  protected handleQuery = (query: string) => {
    this.changeSelected(null);
    if (this.props.minLength > query.length) { this.setState({list: []}); return; }
    if (this.localList) {
      this.searchInItems(query);
    } else {
      this.searchInRemoteEndpoint(query);
    }
  }

  protected handleSelect = (selected: Item) => {
    this.changeSelected(selected);
    this.setState({list: []});
  }

  protected changeSelected = (selected: Item) => {
    this.setState({selected});
    if (this.props.onChange) { this.props.onChange(selected); }
  }

  protected searchInRemoteEndpoint(query: string): void {
    (this.props.source as ISourceTypeCallback<Item>)(query).then((list) => {
      this.setState({list});
    });
  }

  protected searchInItems(query: string): void {
    const matcher: ITypeaheadMatcher<Item>  = this.props.matcher || this.defaultMatcher;
    const list: Item[] = matcher(query, this.localList);
    this.setState({list});
  }

  public render(): React.ReactElement<{}> {
    const List: new () => TypeaheadList<Item> = TypeaheadList as any;
    const { selected, list }: any = this.state;
    const currentLabel: string = selected ? this.label(selected) : '';
    const currentList: Item[] = list || [];
    const currentClasses: string = `typeahead ${currentList.length > 0 ? 'typeahead_open' : ''}`;
    const itemRender: any = this.props.itemRender || Typeahead.defaultRenderer;

    return (
      <div className={currentClasses}>
        <TypeaheadQuery onChange={this.handleQuery} value={currentLabel} />
        <List onSelect={this.handleSelect} list={currentList} itemRender={itemRender} />
      </div>
    );
  }
}
