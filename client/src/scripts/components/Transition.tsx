import * as React from 'react';
import { Transition as ReactTransition } from 'react-transition-group';
import { TransitionProps } from 'react-transition-group/transition';
import { withStyles, css, WithStyleProps } from '../helpers/WithStyles';

type Style = {
  default: React.CSSProperties;
  entering: React.CSSProperties;
  entered: React.CSSProperties;
  exiting: React.CSSProperties;
  exited: React.CSSProperties;
};
type InjectedProps = WithStyleProps<Style>;
interface Props extends Partial<TransitionProps> {}

@withStyles<Style>(() => ({
  default: {
    transitionProperty: 'opacity',
    transitionTimingFunction: 'ease',
  },
  entering: {
    opacity: 0,
  },
  entered: {
    opacity: 1,
  },
  exiting: {
    opacity: 0,
  },
  exited: {
    opacity: 0,
  },
}))
class Transition extends React.Component<Props, {}> {
  static defaultProps: Partial<Props> = {
    in: true,
    timeout: 250,
  };

  render() {
    type MergedProps = Props & typeof Transition.defaultProps & InjectedProps & { children: React.ReactChildren };
    const { styles, timeout, children } = this.props as MergedProps;
    const wrapFn = (state: string) => (
      <div
        {...css(styles.default, (styles as any)[state])}
        style={{
          transitionDuration: `${timeout}ms`,
        }}
      >
        {children}
      </div>
    );

    return (
      <ReactTransition {...this.props as any} timeout={timeout} mountOnEnter unmountOnExit>
        {wrapFn}
      </ReactTransition>
    );
  }
}

export default Transition;
