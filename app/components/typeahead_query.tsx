/// <reference path="../../typings/tsd.d.ts" />

import * as React from 'react';

interface ITypeaheadQueryState {
  query: string;
}

interface ITypeaheadQueryProps {
  onChange: (query: string) => void;
  value?: string;
}


export class TypeaheadQuery extends React.Component<ITypeaheadQueryProps, ITypeaheadQueryState> {
  constructor(props: ITypeaheadQueryProps, context: any) {
    super(props, context);
    this.state = {query: props.value};
  }

  protected handleKeyPress = (event: React.FormEvent): void => {
    const value: string = (event.target as HTMLInputElement).value;
    this.setState({query: value});
    this.props.onChange(value);
  }

  public componentWillReceiveProps(newProps: ITypeaheadQueryProps): void {
    if (newProps.value) {
      this.setState({query: newProps.value});
    }
  }

  public render(): React.ReactElement<{}> {
    return (
      <div>
        <input type='text' value={this.state.query} onChange={this.handleKeyPress} />
      </div>
    );
  }
}
