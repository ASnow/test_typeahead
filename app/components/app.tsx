/// <reference path="../../typings/tsd.d.ts" />

import * as React from 'react';

import { Autocomplete } from './autocomplete';
import 'isomorphic-fetch';

export class App extends React.Component<void, void> {

  protected changeLogger = (item: any) => console.log('Change:', item)
  protected itemRender = (item: any) => <a>{item.label}</a>
  protected reactLink: any = {requestChange: this.changeLogger, value: null};

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
    return (<div>
        <div>
          Поиск улиц по запросу:
          <Autocomplete fetch={this.asyncSearch} valueLink={this.reactLink} itemRender={this.itemRender} />
        </div>
      </div>
    );
  }
}
