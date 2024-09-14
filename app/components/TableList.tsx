import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Key } from "react";
import Button from "./Button";

export type TableColumn<T> = {
  name: string;
  accessor: (obj: T) => string | JSX.Element | JSX.Element[];
};

export type Action<T> = {
  icon: IconProp;
  action: (obj: T) => void;
};

export default function TableList<T>(props: {
  columns: TableColumn<T>[];
  keyAccessor: (obj: T) => Key;
  data: T[];
  emptyMessage?: string;
  actions: Action<T>[]
}) {
  return (
    <table className={"w-full mb-6"}>
      <thead>
        <tr className="divide-x divide-slate-100">
          {props.columns.map((column) => (
            <th className="p-2 border-b">{column.name}</th>
          ))}
          <th className="p-2 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        {props.data.map((obj) => (
          <tr
            key={props.keyAccessor(obj)}
            className="even:bg-slate-50 hover:bg-slate-100 transition-colors divide-x divide-slate-100"
          >
            {props.columns.map((column) => 
            <td className="p-2">{column.accessor(obj)}</td>)}
            
            <td className="p-2 flex justify-center gap-2">

              {props.actions.map(action => <Button
                className="size-8 flex justify-center items-center"
                onClick={_ => action.action(obj)}
              >
                <FontAwesomeIcon icon={action.icon} />
              </Button>)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
