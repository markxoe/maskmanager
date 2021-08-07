import React, { useReducer } from "react";
import { getCurrentWear } from "../functions/Masks";
import { Context, State, Action, ActionTypes } from "./Types";
import produce from "immer";

export const AppContext = React.createContext<Context>({} as Context);

const initialState: State = {
  masks: [],
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionTypes.ADD_MASK:
      return { ...state, masks: [...state.masks, action.payload] };

    case ActionTypes.ADD_WEAR:
      return produce(state, (draft) => {
        const mask = draft.masks.find((i) => i.id === action.payload.maskid);
        if (mask) mask.wears = [...mask.wears, action.payload.wear];
      });

    case ActionTypes.STOP_CURRENT_WEAR:
      return produce(state, (draft) => {
        const mask = draft.masks.find((i) => i.id === action.payload.id);
        if (mask) {
          const wear = getCurrentWear(mask);
          if (wear) wear.endTime = Date.now();
        }
      });

    case ActionTypes.WEAR_END_TIME:
    case ActionTypes.WEAR_START_TIME:
      return produce(state, (draft) => {
        const mask = draft.masks.find((i) => i.id === action.payload.maskid);
        if (mask) {
          const wear = mask.wears.find((i) => i.id === action.payload.wearid);
          if (wear && action.payload.newStartTime)
            wear.startTime = action.payload.newStartTime;
          if (wear && action.payload.newEndTime)
            wear.endTime = action.payload.newEndTime;
        }
      });

    case ActionTypes.DELETE_WEAR:
      return produce(state, (draft) => {
        const mask = draft.masks.find((i) => i.id === action.payload.mask.id);
        if (mask)
          mask.wears = mask.wears.filter(
            (i) => i.id !== action.payload.wear.id
          );
      });

    case ActionTypes.DELETE_MASK:
      return produce(state, (draft) => {
        draft.masks = draft.masks.filter((i) => i.id !== action.payload.id);
      });

    default:
      return state;
  }
};

export const AppContextProvider: React.FC = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const context: Context = { state, dispatch };
  return (
    <AppContext.Provider value={context}>{props.children}</AppContext.Provider>
  );
};
