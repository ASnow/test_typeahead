/// <reference path="../../typings/tsd.d.ts" />

import * as React from 'react';
import { TypeaheadQuery } from './typeahead_query';
import { TypeaheadList } from './typeahead_list';
import { ITypeaheadItem, ISourceTypes, ISourceTypeCallback, ITypeaheadMatcher } from './typeahead.model';




interface ITypeaheadProps<Item> {
  source?: ISourceTypes<Item>;
  minLength?: number;
  matcher?: ITypeaheadMatcher<Item>;
}

interface ITypeaheadState<Item> {
  selected?: Item;
  list?: Item[];
}


export class Typeahead<Item extends ITypeaheadItem> extends React.Component<ITypeaheadProps<Item>, ITypeaheadState<Item>> {
  public static defaultMathcer(query: string, items: any[]): any[] {
    return items.filter((item: any) => { return item.label.indexOf(query) > -1; });
  }

  protected localList: Item[] = null;

  constructor(props: ITypeaheadProps<Item>, context: any) {
    super(props, context);
    if (props.source instanceof Array) {
      this.localList = props.source as Item[];
    }
    this.state = {};
  }

  protected handleQuery = (query: string) => {
    this.setState({selected: null});
    if (this.props.minLength > query.length) { this.setState({list: []}); return; }
    if (this.localList) {
      this.searchInItems(query);
    } else {
      this.searchInRemoteEndpoint(query);
    }
  }

  protected handleSelect = (selected: Item) => {
    this.setState({selected, list: []});
  }

  protected searchInRemoteEndpoint(query: string): void {
    (this.props.source as ISourceTypeCallback<Item>)(query).then((list) => {
      this.setState({list});
    });
  }

  protected searchInItems(query: string): void {
    const matcher: ITypeaheadMatcher<Item>  = this.props.matcher || Typeahead.defaultMathcer;
    const list: Item[] = matcher(query, this.localList);
    this.setState({list});
  }

  public render(): React.ReactElement<{}> {
    const { selected, list }: any = this.state;
    const currentLabel: string = selected ? selected.label : '';
    const currentList: Item[] = list || [];
    const currentClasses: string = `dropdown ${currentList.length > 0 ? 'open' : ''}`

    return (
      <div className={currentClasses}>
        <TypeaheadQuery onChange={this.handleQuery} value={currentLabel} />
        <TypeaheadList onSelect={this.handleSelect} list={currentList} />
        Значение: {currentLabel}
      </div>
    );
  }
}
