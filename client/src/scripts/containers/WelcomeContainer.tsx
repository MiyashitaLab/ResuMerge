import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { css, withStyles, WithStyleProps } from '../helpers/WithStyles';
import { RootState } from '../reduces';
import { actions as apiActions } from '../actions/api';

import Loading from '../components/Loading';
import Centering from '../components/Centering';

type Style = {
  row: React.CSSProperties;
};

type Props = {};
type StateProps = {};
type DispatchProps = {
  actions: typeof apiActions;
};
type InjectedProps = WithStyleProps<Style> & StateProps & DispatchProps;

@connect<RootState, Props>(
  function mapStateToProps(_state): StateProps {
    return {};
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
}))
class WelcomeContainer extends React.Component<Props, {}> {
  componentDidMount() {
    const props = this.props as Props & InjectedProps;
    props.actions.fetchServerStatus();
  }

  render() {
    const { styles } = this.props as Props & InjectedProps;
    return (
      <Centering>
        <Centering {...css(styles.row)}>
          <Loading color="#FAFAFA" />
        </Centering>
        <Centering {...css(styles.row)}>
          <span>Loading...</span>
        </Centering>
      </Centering>
    );
  }
}

export default WelcomeContainer;
