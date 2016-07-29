/// <reference path="../../typings/tsd.d.ts" />

import * as React from 'react';

import { Typeahead } from './typeahead';
import 'isomorphic-fetch';

export class App extends React.Component<void, void> {
  protected asyncSearch(query: string): Promise<any> {
    return fetch(`/data.json?q=${query}`).then((response) => {
      if (response.status === 200) {
        return response.json<any[]>();
      } else {
        alert('ЗАПРОС ВЕРНУЛ ОШИБКУ');
      }
    });
  }

  public render(): React.ReactElement<{}> {
    let items: any[] = [
      {label: 'test1', value: '123'},
      {label: 'test2', value: '123'},
      {label: 'test3', value: '123'},
      {label: 'test4', value: '123'},
      {label: 'test5', value: '123'},
      {label: 'test6', value: '123'},
    ];

    return (<div>
        <div>
          Поиск по заданному массиву:
          <Typeahead source={items} minLength={2} />
        </div>
        <div>
          Поиск по запросу:
          <Typeahead source={this.asyncSearch} minLength={2} />
        </div>
      </div>
    );
  }
}
