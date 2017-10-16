import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { autobind } from 'core-decorators';
import { css, withStyles, WithStyleProps } from '../helpers/WithStyles';
import Select from 'react-select';

import { RootState } from '../reduces';
import { actions as csvConfigActions } from '../actions/config/csv';

type Style = {
  button: React.CSSProperties;
};
type Props = {};
type StateProps = {
  options: { label: string; value: string }[];
  headerBind: Dict<string | null>;
};
type DispatchProps = {
  actions: typeof csvConfigActions;
};
type InjectedProps = WithStyleProps<Style> & StateProps & DispatchProps;

@connect<RootState, Props>(
  function mapStateToProps(state): StateProps {
    return {
      options: state.csv.headers ? state.csv.headers.map(h => ({ label: h, value: h })) : [],
      headerBind: state.config.csv.headerBind,
    };
  },
  function mapDispatchToProps(dispatch): DispatchProps {
    return {
      actions: bindActionCreators({ ...csvConfigActions }, dispatch),
    };
  }
)
@withStyles<Style>(() => ({
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
class SetupCSVHeaderContainer extends React.Component<Props, {}> {
  private static headers = [
    { key: 'timestamp', label: 'タイムスタンプ', regexp: /timestamp|タイムスタンプ|time|時間|date|日付|日時/i },
    { key: 'title', label: '論文タイトル', regexp: /title|タイトル|論文名/i },
    { key: 'author', label: '著者名', regexp: /author|著者|name|氏名|名前|姓名/i },
    { key: 'grade', label: '学年', regexp: /grade|学年|year|school/i },
    { key: 'pdfUrl', label: 'PDF URL', regexp: /pdf|url|file|ファイル/i },
  ];

  componentDidMount() {
    this.setSuggestValue();
  }

  setSuggestValue() {
    const { options, actions } = this.props as Props & InjectedProps;
    const { headers } = SetupCSVHeaderContainer;

    headers.forEach(info => {
      options.forEach(({ value }) => {
        if (info.regexp.test(value)) {
          actions.setHeaderBind(info.key, value);
        }
      });
    });
  }

  @autobind()
  onChange(key: string, select: { value: string } | null) {
    const { actions } = this.props as Props & InjectedProps;
    actions.setHeaderBind(key, select ? select.value : null);
  }

  @autobind()
  onClickNext() {
    const { actions } = this.props as Props & InjectedProps;
    actions.checkParams();
  }

  render() {
    const { styles, options, headerBind } = this.props as Props & InjectedProps;
    const { headers } = SetupCSVHeaderContainer;

    return (
      <div>
        <h2 style={{ textAlign: 'center' }}>CSV ヘッダーの対応関係設定</h2>
        {headers.map(info => (
          <div key={info.key}>
            <p>{info.label}</p>
            <div style={{ marginTop: 0 }}>
              <Select
                onChange={this.onChange.bind(null, info.key)}
                value={headerBind[info.key] || ''}
                name={info.key}
                options={options}
                searchable={false}
              />
            </div>
          </div>
        ))}
        <button onClick={this.onClickNext} type="button" {...css(styles.button)}>
          次へ
        </button>
      </div>
    );
  }
}

export default SetupCSVHeaderContainer;
