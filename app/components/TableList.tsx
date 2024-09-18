import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Key } from "react";
import Button from "./Button";
import { mergeCss } from "@/utils/mergeCss";

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
  data?: T[];
  emptyMessage?: string;
  actions: Action<T>[];
  sortingFn?: (a: T, b: T) => number;
  style?: string;
}) {
  return (
    <table className={mergeCss("w-full", props.style)}>
      <thead>
        <tr className="divide-x divide-zinc-100 dark:divide-zinc-700">
          {props.columns.map((column) => (
            <th
              key={`header-${column.name}`}
              className="p-2 border-b border-zinc-100 dark:border-zinc-700"
            >
              {column.name}
            </th>
          ))}
          <th className="p-2 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        {(props.data ?? []).sort(props.sortingFn).map((obj) => (
          <tr
            key={props.keyAccessor(obj)}
            className="even:bg-zinc-50 hover:bg-zinc-100 transition-colors divide-x divide-zinc-100 dark:even:bg-zinc-950 dark:hover:bg-zinc-800 dark:divide-zinc-700"
          >
            {props.columns.map((column) => (
              <td
                key={`cell-${column.name}-${props.keyAccessor(obj)}`}
                className="p-2"
              >
                {column.accessor(obj)}
              </td>
            ))}

            <td className="p-2 flex justify-center gap-2">
              {props.actions.map((action, index) => (
                <Button
                  key={`action-${index}-${props.keyAccessor(obj)}`}
                  className="size-8 flex justify-center items-center"
                  onClick={(_) => action.action(obj)}
                >
                  <FontAwesomeIcon icon={action.icon} />
                </Button>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
