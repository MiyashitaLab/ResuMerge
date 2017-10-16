import * as React from 'react';
import { css, withStyles, WithStyleProps } from '../helpers/WithStyles';

type Style = {
  base: React.CSSProperties;
  ball: React.CSSProperties;
};

type InjectedProps = WithStyleProps<Style>;
interface Props {
  size?: number;
  color?: string;
  circleCount?: number;
}

const ballScaleKeyframe = {
  '0%': {
    transform: 'scale(0.0)',
    opacity: 0,
  },
  '5%': {
    opacity: 1,
  },
  '75%': {
    transform: 'scale(1.0)',
    opacity: 0,
  },
  '100%': {
    transform: 'scale(1.0)',
    opacity: 0,
  },
};
@withStyles<Style>(() => ({
  base: {
    position: 'relative',
  },
  ball: {
    borderRadius: '100%',
    position: 'absolute',
    top: 0,
    opacity: 0,
    margin: 0,
    animationName: [ballScaleKeyframe],
    animationDuration: '1.5s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'linear',
  },
}))
class Loading extends React.Component<Props, {}> {
  static defaultProps = {
    size: 60,
    color: '#FFFFFF',
    circleCount: 3,
  };

  render() {
    const props = this.props as Props & typeof Loading.defaultProps & InjectedProps;

    const { styles, size, color, circleCount } = props;
    const circles = [];
    for (let idx = 0; idx < circleCount; idx++) {
      circles.push(
        <div
          key={idx}
          {...css(styles.ball)}
          style={{
            width: size,
            height: size,
            left: -size / 2,
            backgroundColor: color,
            animationDelay: `${0.3 * (idx - circleCount)}s`,
          }}
        />
      );
    }
    return (
      <div
        {...css(styles.base)}
        style={{
          width: size,
          height: size,
        }}
      >
        <div style={{ transform: `translateX(${size / 2}px)` }}>{circles}</div>
      </div>
    );
  }
}

export default Loading;
