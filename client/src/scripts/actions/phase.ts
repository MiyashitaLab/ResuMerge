import { Dispatch } from 'redux';

export const ActionType = {
  CHANGE_PHASE: 'CHANGE_PHASE' as 'CHANGE_PHASE',
};

type ChangePhaseAction = {
  type: typeof ActionType.CHANGE_PHASE;
  payload: string;
};
function changePhase(phase: string) {
  return async (dispatch: Dispatch<any>) => {
    await dispatch<ChangePhaseAction>({
      type: ActionType.CHANGE_PHASE,
      payload: phase,
    });
  };
}

export const actions = {
  changePhase,
};

export type Action = ChangePhaseAction;
