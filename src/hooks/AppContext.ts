import { useContext } from "react";
import { AppContext } from "../db/Context";

export const useAppContext = () => {
  return useContext(AppContext);
};
