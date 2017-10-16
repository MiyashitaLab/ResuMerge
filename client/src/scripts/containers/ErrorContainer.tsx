import * as React from 'react';
import { connect } from 'react-redux';
import { css, withStyles, WithStyleProps } from '../helpers/WithStyles';

import { ErrorInfo } from '../reduces/errors';
import { RootState } from '../reduces';
import Transition from '../components/Transition';

type Style = {
  base: React.CSSProperties;
  header: React.CSSProperties;
  errorList: React.CSSProperties;
  error: React.CSSProperties;
};
type Props = {};
type StateProps = {
  errors: ErrorInfo[];
};
type DispatchProps = {};
type InjectedProps = WithStyleProps<Style> & StateProps & DispatchProps;

@connect<RootState, Props>(
  function mapStateToProps(state): StateProps {
    return { errors: state.errors };
  },
  function mapDispatchToProps(_dispatch): DispatchProps {
    return {};
  }
)
@withStyles<Style>(() => ({
  base: {
    fontSize: '0.75rem',
    padding: '1.0rem',
    borderRadius: '0.25rem',
    borderWidth: '0.25rem',
    borderColor: '#F06292',
    borderStyle: 'solid',
    backgroundColor: '#E91E63',
  },
  header: {
    fontSize: '1.0rem',
  },
  errorList: {
    listStyle: 'none',
    padding: '0 1.0rem',
  },
  error: {
    margin: 0,
    ':before': {
      content: '"\\2714"',
      display: 'inline-block',
      padding: '0 0.5em',
    },
  },
}))
class ErrorContainer extends React.Component<Props, {}> {
  render() {
    const { styles, errors } = this.props as Props & InjectedProps;
    const hasErrors = errors.length !== 0;

    return hasErrors ? (
      <Transition appear>
        <div {...css(styles.base)}>
          <h1 {...css(styles.header)}>エラーが発生しました</h1>
          <ul {...css(styles.errorList)}>
            {errors.map((info, idx) => (
              <li key={idx} {...css(styles.error)}>
                <span>{info.message}</span>
              </li>
            ))}
          </ul>
        </div>
      </Transition>
    ) : null;
  }
}

export default ErrorContainer;
