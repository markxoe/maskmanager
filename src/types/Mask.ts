export interface Mask {
  id: string;
  auspackungszeit: number;
  wears: Wears[];
}

export interface Wears {
  id: string;
  startTime: number;
  endTime?: number;
}

export interface WearWithID extends Wears {
  id: string;
}
