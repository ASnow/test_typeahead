/// <reference path="../../typings/tsd.d.ts" />

import * as React from 'react';
import { Typeahead } from './typeahead';
import { IItemRenderable } from './typeahead.model';


interface IItem {
  id?: number;
  name?: string;
  label?: string;
}
interface IReactLink {
  value: any;
  requestChange: (item: any) => void;
}


interface IAutocompleteProps extends IItemRenderable<IItem> {
  fetch?: (query: string) => Promise<IItem[]>;
  valueLink?: IReactLink;
}

export class Autocomplete extends React.Component<IAutocompleteProps, {}> {
  public render(): React.ReactElement<{}> {
    const { fetch, valueLink, itemRender }: any = this.props;

    return (
      <div>
        <Typeahead source={fetch} onChange={valueLink.requestChange}  value={valueLink.value} labelMap={(item: IItem) => item.label || item.name} itemRender={itemRender} minLength={2} />
      </div>
    );
  }
}


// valueLink - это байндинг выбранного значения к стейту формы
// fetch - асинхронная функция, возвращающая массив с данными для выбора
// itemRender - функция, возвращающая компонент, отрисовывающий элемент списка выбора
// es6/7 (babel) или typescript на выбор
// язык для стилей less или sass
// сборка - webpack
// если появятся вопросы - задавайте
