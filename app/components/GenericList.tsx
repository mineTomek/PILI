import { useCallback, useEffect, useState } from "react";
import TableList, { Action, TableColumn } from "./TableList";
import Button from "./Button";

export default function GenericList<T>(props: {
  refreshKey?: number;
  dataType: string;
  columns: TableColumn<T>[];
  keyAccessor: (obj: T) => string;
  defaultNewItem: Partial<T>;
  actions: (loadData: () => void) => Action<T>[];
  sortingFn?: (a: T, b: T) => number;
  searchQuery?: string;
}) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const url = props.searchQuery
      ? `/api/${props.dataType}/get?q=${encodeURIComponent(props.searchQuery)}`
      : `/api/${props.dataType}/get`;

    const response = await fetch(url);
    console.log(response);
    const loadedData: T[] = (await response.json()).items;
    setData(loadedData);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.dataType, props.searchQuery, props.refreshKey]);

  useEffect(() => {
    loadData();
  }, [loadData, props.refreshKey]);

  return (
    <div className="w-full flex flex-col items-center">
      <TableList
        columns={props.columns}
        keyAccessor={props.keyAccessor}
        data={data}
        actions={props.actions(loadData)}
        sortingFn={props.sortingFn}
        style={!loading && (data ?? []).length !== 0 ? "mb-6" : undefined}
      />

      {loading && <p className="mx-auto mb-6 mt-4">Loading...</p>}

      {(data ?? []).length === 0 && !loading && (
        <div className="flex justify-center mb-6 mt-4">No Data Found</div>
      )}

      <Button
        onClick={async () => {
          const response = await fetch(`/api/${props.dataType}/add`, {
            method: "POST",
            body: JSON.stringify(props.defaultNewItem),
            headers: { "Content-Type": "application/json" },
          });

          if (response.ok) {
            console.log(response.ok);
            loadData();
          }
        }}
      >
        Add New
      </Button>
    </div>
  );
}
