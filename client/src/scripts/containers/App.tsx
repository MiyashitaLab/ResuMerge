import * as React from 'react';
import { connect } from 'react-redux';
import { TransitionGroup } from 'react-transition-group';
import { css, withStyles, WithStyleProps } from '../helpers/WithStyles';

import { RootState } from '../reduces';
import Transition from '../components/Transition';
import WelcomeContainer from './WelcomeContainer';
import ImportCSVContainer from './ImportCSVContainer';
import SetupCSVHeaderContainer from './SetupCSVHeaderContainer';
import SetupEventInfoContainer from './SetupEventInfoContainer';
import WaitingGeneratedContainer from './WaitingGeneratedContainer';
import CompletedContainer from './CompletedContainer';
import ErrorContainer from './ErrorContainer';

type Style = {
  base: React.CSSProperties;
  header: React.CSSProperties;
};

type Props = {};
type StateProps = {
  phase: string;
};
type DispatchProps = {};
type InjectedProps = WithStyleProps<Style> & StateProps & DispatchProps;

const FirstChild: React.SFC = props => {
  const childrenArray = React.Children.toArray(props.children);
  return <div>{childrenArray[0] || null}</div>;
};

@connect<RootState, Props>(
  function mapStateToProps(state): StateProps {
    return { phase: state.phase };
  },
  function mapDispatchToProps(_dispatch): DispatchProps {
    return {};
  }
)
@withStyles<Style>(() => ({
  base: {
    width: 720,
    margin: 'auto',
    padding: '1.0em',
  },
  header: {
    textAlign: 'center',
    paddingBottom: '0.5em',
    borderBottomColor: '#CFD8DC',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
  },
}))
class App extends React.Component<Props, {}> {
  render() {
    const { styles, phase } = this.props as Props & InjectedProps;

    return (
      <div {...css(styles.base)}>
        <h1 {...css(styles.header)}>レジュメ結合ツール ResuMerge</h1>
        <TransitionGroup component={FirstChild as any}>
          {phase === 'WELCOME' && (
            <Transition>
              <WelcomeContainer />
            </Transition>
          )}
          {phase === 'IMPORT_CSV' && (
            <Transition>
              <ImportCSVContainer />
            </Transition>
          )}
          {phase === 'SETUP_CSV_HEADER' && (
            <Transition>
              <SetupCSVHeaderContainer />
            </Transition>
          )}
          {phase === 'SETUP_EVENT_INFO' && (
            <Transition>
              <SetupEventInfoContainer />
            </Transition>
          )}
          {phase === 'WAITING_GENERATED' && (
            <Transition>
              <WaitingGeneratedContainer />
            </Transition>
          )}
          {phase === 'GENERATED_PDF' && (
            <Transition>
              <CompletedContainer />
            </Transition>
          )}
        </TransitionGroup>
        <ErrorContainer />
      </div>
    );
  }
}

export default App;
