import { Dispatch } from 'redux';
import { RootState } from '../../reduces';
import { ErrorInfo } from '../../reduces/errors';
import { actions as errorsActions } from '../errors';
import { actions as phaseActions } from '../phase';

export const ActionType = {
  SET_HEADER_BIND: 'SET_HEADER_BIND' as 'SET_HEADER_BIND',
};
type SetHeaderBindAction = {
  type: typeof ActionType.SET_HEADER_BIND;
  payload: Dict<string | null>;
};
function setHeaderBind(key: string, value: string | null) {
  return async (dispatch: Dispatch<any>) => {
    await errorsActions.resetErrors()(dispatch);

    await dispatch<SetHeaderBindAction>({
      type: ActionType.SET_HEADER_BIND,
      payload: {
        [key]: value,
      },
    });
  };
}

function checkParams() {
  return async (dispatch: Dispatch<any>, getState: () => RootState) => {
    const state = getState();
    const params = state.config.csv.headerBind;

    await errorsActions.resetErrors()(dispatch);
    const errors = [] as ErrorInfo[];
    const headers = [
      { key: 'timestamp', label: 'タイムスタンプ', regexp: /timestamp|タイムスタンプ|time|時間|date|日付|日時/i },
      { key: 'title', label: '論文タイトル', regexp: /title|タイトル|論文名/i },
      { key: 'author', label: '著者名', regexp: /author|著者|name|氏名|名前|姓名/i },
      { key: 'grade', label: '学年', regexp: /grade|学年|year|school/i },
      { key: 'pdfUrl', label: 'PDF URL', regexp: /pdf|url|file|ファイル/i },
    ];

    // Check if empty
    for (const header of headers) {
      if (!params[header.key]) {
        errors.push({
          code: 'EMPTY_HEADER_BIND_VALUE',
          message: `"${header.label}" の項目が選択されていません`,
        });
      }
    }

    // Check duplicated value
    const usedValue = [] as string[];
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value) {
        if (usedValue.indexOf(value) !== -1) {
          errors.push({
            code: 'DUPLICATED_HEADER_BIND_VALUE',
            message: `値 "${value}" が重複しています`,
          });
        }
        usedValue.push(value);
      }
    });

    if (errors.length !== 0) {
      return errorsActions.throwErrors(errors)(dispatch);
    }
    return phaseActions.changePhase('SETUP_EVENT_INFO')(dispatch);
  };
}

export const actions = {
  setHeaderBind,
  checkParams,
};

export type Action = SetHeaderBindAction;
