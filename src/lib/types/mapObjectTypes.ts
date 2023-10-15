import type { TransformType } from "./transformType";

export type MapObjectType = {
  Desk: string;
  Room: string;
};

export type MapObject = {
  id: string;
  type: string;
  transform: TransformType;
};