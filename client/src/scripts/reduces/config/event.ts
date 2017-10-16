import { ActionType, Action } from '../../actions/config/event';

export type EventConfigState = Nullable<{
  title: string;
  date: Date;
  time: string;
  place: string;
}>;
const initState: EventConfigState = {
  title: null,
  date: null,
  time: null,
  place: null,
};

export default function reducer(state = initState, action: Action): EventConfigState {
  switch (action.type) {
    case ActionType.SET_EVENT_INFO: {
      return {
        ...state,
        ...action.payload,
      };
    }
    default: {
      return state;
    }
  }
}
