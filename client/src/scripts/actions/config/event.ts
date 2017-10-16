import { Dispatch } from 'redux';
import { RootState } from '../../reduces';
import { ErrorInfo } from '../../reduces/errors';
import { actions as errorsActions } from '../errors';
import { actions as phaseActions } from '../phase';

export const ActionType = {
  SET_EVENT_INFO: 'SET_EVENT_INFO' as 'SET_EVENT_INFO',
};
type SetEventInfoAction = {
  type: typeof ActionType.SET_EVENT_INFO;
  payload: Dict<string | Date | null>;
};
function setEventInfo(key: string, value: string | Date | null) {
  return async (dispatch: Dispatch<any>) => {
    await errorsActions.resetErrors()(dispatch);

    await dispatch<SetEventInfoAction>({
      type: ActionType.SET_EVENT_INFO,
      payload: {
        [key]: value,
      },
    });
  };
}

function checkParams() {
  return async (dispatch: Dispatch<any>, getState: () => RootState) => {
    const state = getState();
    const params = state.config.event as Dict<any | null>;

    await errorsActions.resetErrors()(dispatch);
    const errors = [] as ErrorInfo[];

    const label = {
      title: 'タイトル',
      date: '日付',
      time: '時間帯',
      place: '場所',
    } as Dict<string>;
    // Check if empty
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (!value) {
        errors.push({
          code: 'EMPTY_HEADER_BIND_VALUE',
          message: `"${label[key]}" の項目が選択されていません`,
        });
      }
    });

    if (errors.length !== 0) {
      return errorsActions.throwErrors(errors)(dispatch);
    }
    return phaseActions.changePhase('WAITING_GENERATED')(dispatch);
  };
}

export const actions = {
  setEventInfo,
  checkParams,
};

export type Action = SetEventInfoAction;
