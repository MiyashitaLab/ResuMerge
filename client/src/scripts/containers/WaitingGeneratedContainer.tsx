import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { autobind } from 'core-decorators';
import { css, withStyles, WithStyleProps } from '../helpers/WithStyles';
import { RootState } from '../reduces';
import { actions as apiActions } from '../actions/api';

import Loading from '../components/Loading';
import Centering from '../components/Centering';
import Transition from '../components/Transition';

type Style = {
  row: React.CSSProperties;
  button: React.CSSProperties;
};

type Props = {};
type StateProps = {
  hasErrors: boolean;
};
type DispatchProps = {
  actions: typeof apiActions;
};
type InjectedProps = WithStyleProps<Style> & StateProps & DispatchProps;

@connect<RootState, Props>(
  function mapStateToProps(state): StateProps {
    return {
      hasErrors: state.errors.length !== 0,
    };
  },
  function mapDispatchToProps(dispatch): DispatchProps {
    return {
      actions: bindActionCreators({ ...apiActions }, dispatch),
    };
  }
)
@withStyles<Style>(() => ({
  row: {
    width: '100%',
  },
  button: {
    width: '100%',
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
}))
class WaitingGeneratedContainer extends React.Component<Props, {}> {
  componentDidMount() {
    this.generatePDF();
  }

  generatePDF() {
    const { actions } = this.props as Props & InjectedProps;
    actions.generatePDF();
  }

  @autobind()
  onClickRegenerate() {
    this.generatePDF();
  }

  render() {
    const { styles, hasErrors } = this.props as Props & InjectedProps;
    return (
      <Centering>
        <Centering {...css(styles.row)}>
          <h2>結合しています...</h2>
        </Centering>
        <Centering {...css(styles.row)}>
          <Loading color="#FAFAFA" />
        </Centering>
        <Centering {...css(styles.row)}>
          <span>Generating...</span>
        </Centering>
        {hasErrors && (
          <Transition appear>
            <button onClick={this.onClickRegenerate} type="button" {...css(styles.button)}>
              もう一度実行する
            </button>
          </Transition>
        )}
      </Centering>
    );
  }
}

export default WaitingGeneratedContainer;
