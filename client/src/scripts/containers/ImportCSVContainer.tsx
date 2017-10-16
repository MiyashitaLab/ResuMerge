import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dropzone from 'react-dropzone';
import { autobind } from 'core-decorators';
import { css, withStyles, WithStyleProps } from '../helpers/WithStyles';
import { RootState } from '../reduces';
import { actions as csvActions } from '../actions/csv';

import Centering from '../components/Centering';

type Style = {
  fullwidth: React.CSSProperties;
  dropzone: React.CSSProperties;
  hover: React.CSSProperties;
  wrapper: React.CSSProperties;
};
type Props = {};
type StateProps = {};
type DispatchProps = {
  actions: typeof csvActions;
};
type InjectedProps = WithStyleProps<Style> & StateProps & DispatchProps;

@connect<RootState, Props>(
  function mapStateToProps(_state): StateProps {
    return {};
  },
  function mapDispatchToProps(dispatch): DispatchProps {
    return {
      actions: bindActionCreators({ ...csvActions }, dispatch),
    };
  }
)
@withStyles<Style>(() => {
  const hoverCSS = {
    background:
      'repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25) 25%, transparent 25%, transparent 50%, rgba(0, 0, 0, 0.25) 50%, rgba(0, 0, 0, 0.25) 75%, transparent 75%, transparent)',
    backgroundSize: '30px 30px',
    animationName: [
      {
        from: {
          backgroundPosition: '0 0',
        },
        to: {
          backgroundPosition: '60px 30px',
        },
      },
    ],
    animationDuration: '1s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'linear',
  };

  return {
    fullwidth: {
      width: '100%',
    },
    dropzone: {
      height: '250px',
      borderRadius: '0.25rem',
      borderWidth: '0.25rem',
      borderStyle: 'dashed',
      borderColor: '#CFD8DC',
      cursor: 'pointer',
      ':hover': hoverCSS,
    },
    hover: hoverCSS,
    wrapper: {
      width: '100%',
      height: '100%',
    },
  };
})
class ImportCSVContainer extends React.Component<Props, {}> {
  @autobind()
  onSelectFile(files: File[], _event: any) {
    const props = this.props as Props & InjectedProps;
    if (files.length >= 1) {
      props.actions.importCSV(files[0]);
    }
  }

  render() {
    const { styles } = this.props as Props & InjectedProps;

    return (
      <Centering>
        <h2 {...css(styles.fullwidth)}>CSV インポート</h2>
        <p {...css(styles.fullwidth)}>Google Forms からエクスポートした CSV ファイルを読み込みます</p>
        <Dropzone
          onDropAccepted={this.onSelectFile}
          {...css(styles.fullwidth, styles.dropzone)}
          activeClassName={css(styles.hover).className}
        >
          <Centering {...css(styles.wrapper)}>
            <div>
              <p>CSV ファイルをドラッグ & ドロップしてください</p>
            </div>
          </Centering>
        </Dropzone>
      </Centering>
    );
  }
}

export default ImportCSVContainer;
