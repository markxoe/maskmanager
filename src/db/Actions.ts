import { Mask, Wears } from "../types/Mask";
import { Action, ActionTypes, State } from "./Types";

export const ActionAddMask = (mask: Mask): Action => {
  return { type: ActionTypes.ADD_MASK, payload: mask };
};

export const ActionAddWear = (mask: Mask, wear: Wears): Action => ({
  type: ActionTypes.ADD_WEAR,
  payload: { maskid: mask.id, wear },
});

export const ActionUltimate = (fn: (state: State) => State): Action => ({
  type: ActionTypes.ULTIMATE,
  payload: fn,
});

export const ActionStopCurrentWear = (mask: Mask): Action => ({
  type: ActionTypes.STOP_CURRENT_WEAR,
  payload: mask,
});

export const ActionSetWearStartTime = (
  maskid: string,
  wearid: string,
  newStartTime: number
): Action => ({
  type: ActionTypes.WEAR_START_TIME,
  payload: { maskid, wearid, newStartTime },
});

export const ActionSetWearEndTime = (
  maskid: string,
  wearid: string,
  newEndTime: number
): Action => ({
  type: ActionTypes.WEAR_START_TIME,
  payload: { maskid, wearid, newEndTime },
});

export const ActionDeleteWear = (mask: Mask, wear: Wears): Action => ({
  type: ActionTypes.DELETE_WEAR,
  payload: { mask, wear },
});

export const ActionDeleteMask = (mask: Mask): Action => ({
  type: ActionTypes.DELETE_MASK,
  payload: mask,
});
