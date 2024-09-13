import DataObject from "./DataObject";

type Item = DataObject & {
  storage_id?: string;
  description?: string;
  category?: string;
};

export default Item;
