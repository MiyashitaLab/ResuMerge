import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { autobind } from 'core-decorators';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MomentLocaleUtils from 'react-day-picker/moment';
import * as moment from 'moment';
import { Moment } from 'moment';
import 'moment/locale/ja';
import { css, withStyles, WithStyleProps } from '../helpers/WithStyles';

import { RootState } from '../reduces';
import { actions as configEventActions } from '../actions/config/event';
import { EventConfigState } from '../reduces/config/event';

type Style = {
  pickerContainer: React.CSSProperties;
  input: React.CSSProperties;
  button: React.CSSProperties;
};
type Props = {};
type StateProps = {
  params: EventConfigState;
};
type DispatchProps = {
  actions: typeof configEventActions;
};
type InjectedProps = WithStyleProps<Style> & StateProps & DispatchProps;

@connect<RootState, Props>(
  function mapStateToProps(state): StateProps {
    return {
      params: {
        ...state.config.event,
      },
    };
  },
  function mapDispatchToProps(dispatch): DispatchProps {
    return {
      actions: bindActionCreators({ ...configEventActions }, dispatch),
    };
  }
)
@withStyles<Style>(() => ({
  pickerContainer: {
    width: '100%',
    color: 'initial',
  },
  input: {
    width: '100%',
    fontSize: '1.0rem',
    lineHeight: 1.25,
    padding: '0.5em',
    borderRadius: '0.25rem',
    outline: 'none',
    fontFamily: 'inherit',
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
class SetupEventInfoContainer extends React.Component<Props, {}> {
  @autobind()
  onChangeInput(key: string, ev: React.UIEvent<HTMLInputElement>) {
    this.onChange(key, (ev.target as HTMLInputElement).value);
  }

  @autobind()
  onChangeDate(key: string, value: Moment) {
    this.onChange(key, value.toDate());
  }

  @autobind()
  onChange(key: string, value: string | Date) {
    const { actions } = this.props as Props & InjectedProps;
    if (typeof value === 'string') {
      actions.setEventInfo(key, value);
    } else {
      actions.setEventInfo(key, value);
    }
  }

  @autobind()
  onClickNext() {
    const { actions } = this.props as Props & InjectedProps;
    actions.checkParams();
  }

  render() {
    const { styles, params } = this.props as Props & InjectedProps;

    return (
      <div>
        <h2 style={{ textAlign: 'center' }}>イベント詳細設定</h2>
        <div>
          <p>イベント名</p>
          <div style={{ marginTop: 0 }}>
            <input
              defaultValue={params.title || ''}
              onChange={this.onChangeInput.bind(null, 'title')}
              type="input"
              placeholder="e.g. 宮下研究室 春期発表会"
              {...css(styles.input)}
            />
          </div>
        </div>
        <div>
          <p>日付</p>
          <div style={{ marginTop: 0 }}>
            <DayPickerInput
              component={(props: any) => (
                <input
                  {...props}
                  {...css(styles.input)}
                  defaultValue={params.date ? moment(params.date).format('YYYY/MM/DD') : ''}
                  type="text"
                />
              )}
              onDayChange={this.onChangeDate.bind(null, 'date')}
              format="YYYY/MM/DD"
              dayPickerProps={{
                locale: 'ja',
                localeUtils: MomentLocaleUtils,
              }}
              classNames={{
                ...(DayPickerInput as any).defaultProps.classNames,
                container: `${css(styles.pickerContainer).className} DayPickerInput`,
              }}
            />
          </div>
        </div>
        <div>
          <p>時間帯</p>
          <div style={{ marginTop: 0 }}>
            <input
              defaultValue={params.time || ''}
              onChange={this.onChangeInput.bind(null, 'time')}
              type="input"
              placeholder="e.g. 10:00 ～ 16:30"
              {...css(styles.input)}
            />
          </div>
        </div>
        <div>
          <p>場所</p>
          <div style={{ marginTop: 0 }}>
            <input
              defaultValue={params.place || ''}
              onChange={this.onChangeInput.bind(null, 'place')}
              type="input"
              {...css(styles.input)}
            />
          </div>
        </div>
        <button onClick={this.onClickNext} type="button" {...css(styles.button)}>
          次へ
        </button>
      </div>
    );
  }
}

export default SetupEventInfoContainer;
