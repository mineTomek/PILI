import DataObject from "./DataObject";

type Room = DataObject & {
  house_id: string;
};

export default Room;
