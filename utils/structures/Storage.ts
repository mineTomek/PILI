import DataObject from "./DataObject";

type Storage = DataObject & {
  room_id: string;
  type: "desk" | "shelf" | "drawer" | "other";
  group: string;
  level: number;
  surfacePosition: {
    x: number;
    y: number;
  };
};

export default Storage;
