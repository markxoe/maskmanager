import { useEffect, useState } from "react";

export const useTime = (refreshCycle = 1000) => {
  const [time, setTime] = useState(Date.now());
  useEffect(() => {
    const intervalID = setInterval(() => {
      setTime(Date.now());
    }, refreshCycle);
    return () => clearInterval(intervalID);
  }, [refreshCycle]);
  return time;
};
