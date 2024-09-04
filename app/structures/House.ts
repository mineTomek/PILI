import DataObject from "./DataObject";

type House = DataObject & {
  address: string;
};

export default House;
