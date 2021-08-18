import React, { useEffect, useReducer, useState } from "react";
import { getCurrentWear } from "../functions/Masks";
import { Context, State, Action, ActionTypes } from "./Types";
import produce from "immer";
import { loadState, saveState } from "./persistance";
import { ActionSetState } from "./Actions";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { isPlatform } from "@ionic/react";

export const AppContext = React.createContext<Context>({} as Context);

export const initialState: State = {
  masks: [],
  darkmode: true,
  defaultCameraId: "",
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

    case ActionTypes.SET_STATE:
      return action.payload;

    case ActionTypes.SET_DARKMODE:
      return { ...state, darkmode: action.payload };

    case ActionTypes.SET_CAMERA_ID:
      return { ...state, defaultCameraId: action.payload };

    default:
      return state;
  }
};

export const AppContextProvider: React.FC = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const context: Context = { state, dispatch };
  const [lastSave, setLastSave] = useState<number>(Date.now());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadState().then((newState) => {
      dispatch(ActionSetState(newState));
      setLoaded(true);
      SplashScreen.hide();
    });
  }, []);

  useEffect(() => {
    if (lastSave + 100 < Date.now() && loaded) {
      saveState(state);
      setLastSave(Date.now());
    }
  }, [state, loaded, lastSave]);

  useEffect(() => {
    const body = document.body;
    if (state.darkmode) body.classList.add("dark");
    else body.classList.remove("dark");
    if (isPlatform("hybrid"))
      StatusBar.setStyle({
        style: state.darkmode ? Style.Dark : Style.Light,
      });
    if (isPlatform("hybrid") && isPlatform("android"))
      StatusBar.setBackgroundColor({
        color: state.darkmode ? "#000000" : "#ffffff",
      });
  }, [state.darkmode]);

  return (
    <AppContext.Provider value={context}>{props.children}</AppContext.Provider>
  );
};
