import DataObject from "./DataObject";

type Item = DataObject & {
  storage_id: string;
  category: string;
};

export default Item;
