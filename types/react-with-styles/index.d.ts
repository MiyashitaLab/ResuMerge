declare module 'react-with-styles' {
  import * as React from 'react';

  type StyleObject = {
    [key: string]: React.CSSProperties;
  };

  interface StyleInfo {
    _definition: React.CSSProperties;
    _len: number;
    _name: string;
  }

  export type WithStyleProps<S extends StyleObject> = {
    styles: { [K in keyof S]: StyleInfo };
  };

  export function withStyles<S extends StyleObject>(func: (theme?: any) => S): ClassDecorator;

  export function css(...args: StyleInfo[]): { className: string };
}

declare module 'react-with-styles/lib/ThemedStyleSheet';
