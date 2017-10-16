import { ActionType, Action } from '../actions/phase';

export type PhaseState = string;
const initState: PhaseState = 'WELCOME';

export default function reducer(state = initState, action: Action): PhaseState {
  switch (action.type) {
    case ActionType.CHANGE_PHASE: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
}
