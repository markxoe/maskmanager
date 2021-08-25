import { Dispatch } from "react";
import { Mask } from "../types/Mask";

export interface State {
  masks: Mask[];
  darkmode: boolean;
  defaultCameraDirection: "environment" | "user";
}

export enum ActionTypes {
  ADD_MASK,
  ADD_WEAR,
  ULTIMATE,
  STOP_CURRENT_WEAR,
  WEAR_START_TIME,
  WEAR_END_TIME,
  DELETE_WEAR,
  DELETE_MASK,
  SET_STATE,
  SET_DARKMODE,
  SET_CAMERA_DIRECTION,
}

export interface Action {
  type: ActionTypes;
  payload?: any;
}

export interface Context {
  state: State;
  dispatch: Dispatch<Action>;
}
