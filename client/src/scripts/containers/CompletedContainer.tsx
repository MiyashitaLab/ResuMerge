import * as React from 'react';
import { css, withStyles, WithStyleProps } from '../helpers/WithStyles';

import Centering from '../components/Centering';

type Style = {
  fullwidth: React.CSSProperties;
  button: React.CSSProperties;
  buttonLink: React.CSSProperties;
};
type Props = {};
type InjectedProps = WithStyleProps<Style>;

@withStyles<Style>(() => ({
  fullwidth: {
    width: '100%',
  },
  button: {
    padding: '1.0em',
    backgroundColor: '#7CB342',
    borderRadius: '0.25rem',
    marginTop: '1.25rem',
    boxShadow: '5px 3px 10px 0 #616161',
    ':hover': {
      marginTop: '1.3rem',
      boxShadow: '3px 2px 5px 0 #616161',
    },
    ':active': {
      marginTop: '1.35rem',
      boxShadow: 'none',
    },
  },
  buttonLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
}))
class CompletedContainer extends React.Component<Props, {}> {
  render() {
    const { styles } = this.props as Props & InjectedProps;

    return (
      <Centering>
        <h2 style={{ textAlign: 'center' }}>レジュメが結合されました</h2>
        <Centering {...css(styles.fullwidth)}>
          <a href="/exported.pdf" download="結合レジュメ.pdf" target="_blank" {...css(styles.button, styles.buttonLink)}>
            ダウンロード
          </a>
        </Centering>
      </Centering>
    );
  }
}

export default CompletedContainer;
