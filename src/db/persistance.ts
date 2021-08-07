import { State } from "./Types";
import { Storage } from "@capacitor/storage";
import { initialState } from "./Context";

export const stateKey = "masmmanager-state";

const serializeState = (state: State): string => JSON.stringify(state);
const deserializeState = (input: string): State => JSON.parse(input);

export const saveState = (state: State) => {
  return Storage.set({ key: stateKey, value: serializeState(state) });
};

export const loadState = async () => {
  const value = await Storage.get({ key: stateKey });
  if (value.value) {
    try {
      return { ...initialState, ...deserializeState(value.value) };
    } catch (e) {
      return initialState;
    }
  } else {
    return initialState;
  }
};
