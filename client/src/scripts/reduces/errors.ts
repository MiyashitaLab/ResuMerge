import { ActionType, Action } from '../actions/errors';

export type ErrorInfo = { code: string; message: string };
export type ErrorsState = ErrorInfo[];
const initState: ErrorsState = [];

export default function reducer(state = initState, action: Action): ErrorsState {
  switch (action.type) {
    case ActionType.THROW_ERRORS: {
      return action.payload;
    }
    case ActionType.RESET_ERRORS: {
      return [];
    }
    default: {
      return state;
    }
  }
}
