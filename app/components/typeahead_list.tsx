/// <reference path="../../typings/tsd.d.ts" />

import * as React from 'react';
import { IItemRenderable } from './typeahead.model';


interface ITypeaheadSelectable<Item> {
  onSelect: (item: Item) => void;
}

interface ITypeaheadListProps<Item> extends ITypeaheadSelectable<Item>, IItemRenderable<Item> {
  list: Item[];
}
interface ITypeaheadListItemProps<Item> extends ITypeaheadSelectable<Item>, IItemRenderable<Item> {
  item: Item;
  key: number;
}

class TypeaheadListItem<Item> extends React.Component<ITypeaheadListItemProps<Item>, void> {
  protected handleClick = () => {
    this.props.onSelect(this.props.item);
  }

  public render(): React.ReactElement<{}> {
    const { itemRender, item }: any = this.props;

    return (
      <li className='typeahead__list-item' onClick={this.handleClick}>
        {itemRender(item)}
      </li>
    );
  }
}

export class TypeaheadList<Item> extends React.Component<ITypeaheadListProps<Item>, void> {
  protected closeHandler = () => this.props.onSelect(null);

  public componentDidMount(): void {
    document.addEventListener('click', this.closeHandler, false);
  }

  public componentWillUnmount(): void {
    document.removeEventListener('click', this.closeHandler, false);
  }

  public render(): React.ReactElement<any> {
    const ListItem: new () => TypeaheadListItem<Item> = TypeaheadListItem as any;
    const { list, onSelect, itemRender }: any = this.props;

    return (
      <ul className='typeahead__list'>
        {list.map((item: Item, index: number) => {
          return <ListItem key={index} onSelect={onSelect} item={item} itemRender={itemRender} />;
        })}
      </ul>
    );
  }
}
