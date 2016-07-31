/// <reference path="../../typings/tsd.d.ts" />

import * as React from 'react';
import { TypeaheadQuery } from './typeahead_query';
import { TypeaheadQueryHandler } from './typeahead_query_handler';
import { TypeaheadList } from './typeahead_list';
import { ISourceTypes, ITypeaheadMatcher, IItemRenderable, IItemMapable } from './typeahead.model';

export interface ITypeaheadProps<Item> extends IItemRenderable<Item>, IItemMapable {
  source?: ISourceTypes<Item>;
  minLength?: number;
  matcher?: ITypeaheadMatcher<Item>;
  onChange?: (item: Item) => void;
  value?: Item;
}

interface ITypeaheadState<Item> {
  selected?: Item;
  list?: Item[];
}

export class Typeahead<Item> extends React.Component<ITypeaheadProps<Item>, ITypeaheadState<Item>> {
  public label: (item: Item) => string;
  protected queryHandler: TypeaheadQueryHandler<Item>;

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
    this.queryHandler = new TypeaheadQueryHandler<Item>(this, props);
    this.state = {};
    this.label = props.labelMap || Typeahead.defaultLabelMap;
  }

  protected handleQuery = (query: string) => {
    this.queryHandler.run(query);
  }

  protected handleSelect = (selected: Item) => {
    this.changeSelected(selected);
    this.setState({list: null});
  }

  public changeSelected = (selected: Item) => {
    this.setState({selected});
    if (this.props.onChange) { this.props.onChange(selected); }
  }

  public componentWillReceiveProps(newProps: ITypeaheadProps<Item>): void {
    this.setState({selected: newProps.value});
  }

  protected isEmpty(list: Item[]): boolean {
    return !(list && list.length > 0);
  }

  protected renderList(currentList: Item[], itemRender: any = Typeahead.defaultRenderer): React.ReactElement<{}> {
    const List: new () => TypeaheadList<Item> = TypeaheadList as any;
    if (!this.isEmpty(currentList)) {
      return <List onSelect={this.handleSelect} list={currentList} itemRender={itemRender} />;
    }
  }

  public render(): React.ReactElement<{}> {
    const { selected, list }: any = this.state;
    const currentLabel: string = selected ? this.label(selected) : '';
    const currentClasses: string = `typeahead ${this.isEmpty(list) ? '' : 'typeahead_open'}`;

    return (
      <div className={currentClasses}>
        <TypeaheadQuery onChange={this.handleQuery} value={currentLabel} />
        {this.renderList(list, this.props.itemRender)}
      </div>
    );
  }
}
