import { useCallback, useEffect, useState } from "react";
import TableList, { Action, TableColumn } from "./TableList";
import Loading from "./Loading";
import Button from "./Button";

export default function GenericList<T>(props: {
  dataType: string;
  columns: TableColumn<T>[];
  keyAccessor: (obj: T) => string;
  defaultNewItem: Partial<T>;
  actions: (loadData: () => void) => Action<T>[];
}) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const response = await fetch(`/api/${props.dataType}/get`);
    const loadedData: T[] = (await response.json()).items;
    setData(loadedData);
    setLoading(false);
  }, [props.dataType]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full flex flex-col items-center">
      <TableList
        columns={props.columns}
        keyAccessor={props.keyAccessor}
        data={data}
        actions={props.actions(loadData)}
      />

      {data.length === 0 && (
        <div className="p-2 flex justify-center mb-6">No Data Found</div>
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
