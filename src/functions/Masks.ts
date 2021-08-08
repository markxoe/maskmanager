import { Mask, Wears, WearWithID } from "../types/Mask";

export const generateMaskId = (masks: Mask[] = []) => {
  const gen = () => {
    const len = 5;
    const symbols = "QWERTZUOPASDFGHKYXCVBNM1234567890";
    let out: string = "";
    for (let i = 0; i < len; i++) {
      out += symbols[Math.floor(Math.random() * symbols.length)];
    }
    return out;
  };
  let out = "";
  do {
    out = gen();
  } while (findMask(masks, out) !== undefined);
  return out;
};

export const generateWearId = () => {
  const len = 10;
  const symbols =
    "qwertzuiopasdfghjklyxcvbnmQWERTZUIOPASDFGHJKLYXCVBNM1234567890";
  let out: string = "";
  for (let i = 0; i < len; i++) {
    out += symbols[Math.floor(Math.random() * symbols.length)];
  }
  return out;
};

export const maskArrayToIDs = (masks: Mask[]) => masks.map((i) => i.id);

export const isCurrentlyWearing = (mask: Mask) => {
  const latestWear = getLatestWear(mask);
  return latestWear === undefined ? false : latestWear.endTime === undefined;
};

export const getLatestWear = (mask: Mask) => {
  return mask.wears.slice().sort((a, b) => b.startTime - a.startTime)[0];
};

export const getCurrentWear = (mask: Mask) =>
  mask.wears.find((i) => i.endTime === undefined);

export const wearsToArray = (wears: { [key: string]: Wears }): WearWithID[] => {
  return Object.keys(wears).map((key) => ({ ...wears[key], id: key }));
};

export const getWearDuration = (
  wear: Wears,
  notCompleteUntilNow: boolean = false
) =>
  (wear.endTime ?? (notCompleteUntilNow ? Date.now() : wear.startTime)) -
  wear.startTime;

export const getMaskWearDuration = (
  mask: Mask,
  includeCurrent: boolean = false
) => addNumberArray(mask.wears.map((a) => getWearDuration(a, includeCurrent)));

export const addNumberArray = (array: number[]) => {
  let out = 0;
  array.forEach((a) => {
    out += a;
  });
  return out;
};

export const findMask = (masks: Mask[], id: string) =>
  masks.find((i) => i.id === id);

/**
 * Note: ASC is oldest on top, DSC is newest on top
 * @param wears
 * @param by
 * @param asc
 */
export const sortWears = (
  wears: Wears[],
  by: "startTime" | "endTime" | "duration" = "startTime",
  asc: "ASC" | "DSC" = "ASC"
) =>
  wears.slice().sort((a, b) => {
    let va = 0;
    let vb = 0;
    switch (by) {
      case "startTime": {
        va = a.startTime;
        vb = b.startTime;
        break;
      }
      case "endTime": {
        va = a.endTime ?? Infinity;
        vb = b.endTime ?? Infinity;
        break;
      }
      case "duration": {
        va = getWearDuration(a);
        vb = getWearDuration(b);
        break;
      }
    }
    switch (asc) {
      default:
      case "ASC":
        return va - vb;
      case "DSC":
        return vb - va;
    }
  });

export const isMaskValid = (mask: Mask) => {
  let notValid = false;
  const wears = sortWears(mask.wears, "startTime", "ASC");
  for (let i = 0; i < wears.length - 1; i++) {
    const current = wears[i];
    const next = wears[i + 1];

    if ((current.endTime ?? 0) > next.startTime) {
      notValid = true;
    }
  }
  return !notValid;
};

//TODO: Better Calculation

export const calculateSenseofWearing = (mask: Mask) => {
  if (isCurrentlyWearing(mask)) {
    // If you're wearing your mask right now, it's pointless to wear it next
    return 0;
  }
  const latestWear = getLatestWear(mask);

  const oldnessPoints = Math.min(
    latestWear && latestWear.endTime
      ? ((Date.now() - latestWear.endTime) / 1000 / 60 / 60 / 24 / 7) * 200
      : 200,
    200
  ); // Last Wear (If 7 days old -> 200 points)

  const wearCountPoints = (5 - mask.wears.length) * 10; // 50 Points if not worn at all, 0 if worn 5 times
  const wearLength = getMaskWearDuration(mask) / 1000 / 60 / 60;
  const wearPoints =
    (1 / Math.pow(wearLength + 7, 2)) * (100 / (1 / Math.pow(7, 2))); // 100 Points for not wearing it at all. 25 for 7h ...

  // In Excel: 1/(D10+5)^2*(100/(1/(5^2)))

  return oldnessPoints + wearPoints + wearCountPoints;
};
