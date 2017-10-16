import { Dispatch } from 'redux';
import { ErrorInfo } from '../reduces/errors';

export const ActionType = {
  THROW_ERRORS: 'THROW_ERRORS' as 'THROW_ERRORS',
  RESET_ERRORS: 'RESET_ERRORS' as 'RESET_ERRORS',
};

type ThrowErrorsAction = {
  type: typeof ActionType.THROW_ERRORS;
  payload: ErrorInfo[];
};
function throwErrors(errors: ErrorInfo[]) {
  return async (dispatch: Dispatch<any>) => {
    dispatch<ThrowErrorsAction>({
      type: ActionType.THROW_ERRORS,
      payload: errors,
    });
  };
}

type ResetErrorsAction = {
  type: typeof ActionType.RESET_ERRORS;
};
function resetErrors() {
  return async (dispatch: Dispatch<any>) => {
    await dispatch<ResetErrorsAction>({
      type: ActionType.RESET_ERRORS,
    });
  };
}

export const actions = {
  throwErrors,
  resetErrors,
};

export type Action = ThrowErrorsAction | ResetErrorsAction;
