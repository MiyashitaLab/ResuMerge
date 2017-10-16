import { ActionType, Action } from '../actions/csv';

export type CSVState = Nullable<{
  headers: string[];
  data: any;
}>;
const initState: CSVState = {
  headers: [],
  data: null,
};

export default function reducer(state = initState, action: Action): CSVState {
  switch (action.type) {
    case ActionType.IMPORT_CSV: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
}
