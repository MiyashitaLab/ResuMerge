import { ActionType, Action } from '../../actions/config/csv';

export type CSVConfigState = {
  headerBind: Dict<string | null>;
};
const initState: CSVConfigState = {
  headerBind: {},
};

export default function reducer(state = initState, action: Action): CSVConfigState {
  switch (action.type) {
    case ActionType.SET_HEADER_BIND: {
      return {
        headerBind: {
          ...state.headerBind,
          ...action.payload,
        },
      };
    }
    default: {
      return state;
    }
  }
}
