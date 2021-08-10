import { deserializeState } from "../db/persistance";
import { State } from "../db/Types";

const ifUndefinedThrowError = (...inputs: any[]) => {
  if (inputs.some((val) => val === undefined)) throw Error("Error");
};

export const verifyImport = (input: string) => {
  try {
    const state: State = deserializeState(input);
    ifUndefinedThrowError(state.masks);
    state.masks.forEach((mask) => {
      ifUndefinedThrowError(mask.auspackungszeit, mask.id, mask.wears);
    });
    ifUndefinedThrowError(state.darkmode);
    return state;
  } catch (e) {
    return undefined;
  }
};
