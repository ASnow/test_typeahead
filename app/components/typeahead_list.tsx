/// <reference path="../../typings/tsd.d.ts" />

import * as React from 'react';
import { ITypeaheadItem } from './typeahead.model';


interface ITypeaheadSelectable {
  onSelect: (item: ITypeaheadItem) => void;
}

interface ITypeaheadListProps extends ITypeaheadSelectable {
  list: ITypeaheadItem[];
}
interface ITypeaheadListItemProps extends ITypeaheadSelectable {
  item: ITypeaheadItem;
}

class TypeaheadListItem extends React.Component<ITypeaheadListItemProps, void> {
  protected handleClick = () => {
    this.props.onSelect(this.props.item);
  }

  public render(): React.ReactElement<{}> {
    return (
      <li>
        <a onClick={this.handleClick}>
          {this.props.item.label}
        </a>
      </li>
    );
  }
}

export class TypeaheadList extends React.Component<ITypeaheadListProps, void> {
  public render(): React.ReactElement<{}> {
    return (
      <ul className="dropdown-menu">
        {this.props.list.map((item: ITypeaheadItem, index: number) => {
          return (
            <TypeaheadListItem onSelect={this.props.onSelect} item={item} />
          );
        })}
      </ul>
    );
  }
}
