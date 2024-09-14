"use client";

import { useEffect, useState } from "react";
import Button from "../Button";
import { useRouter } from "next/navigation";
import Loading from "../Loading";
import Item from "@/utils/structures/Item";
import { faClone, faEye, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import TableList from "../TableList";

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const loadItems = async () => {
    setLoading(true);
    const response = await fetch("/api/items/get");
    const loadedItems: Item[] = (await response.json()).items;
    setItems(loadedItems);
    setLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full flex flex-col items-center">
      <TableList
        columns={[
          { name: "Name", accessor: (item) => item.name },
          {
            name: "Category",
            accessor: (item) => item.category ?? "No Category",
          },
          {
            name: "Storage",
            accessor: (item) => item.storage_id ?? "No Storage ID",
          },
        ]}
        keyAccessor={(item) => item.id!}
        data={items}
        actions={[
          {
            icon: faTrashCan,
            action: async (item) => {
              const response = await fetch(`/api/items/delete/${item.id}`, {
                method: "DELETE",
              });

              if (response.ok) {
                loadItems();
              }
            },
          },
          {
            icon: faClone,
            action: async (item) => {
              const clonedItem: Item = {
                name: item.name,
                category: item.category,
                storage_id: item.storage_id,
                description: item.description,
              };
              const response = await fetch("/api/items/add", {
                method: "POST",
                body: JSON.stringify(clonedItem),
                headers: { "Content-Type": "application/json" },
              });

              if (response.ok) {
                loadItems();
              }
            },
          },
          {
            icon: faEye,
            action: (item) => router.push(`/item/${item.id}`),
          },
        ]}
      />

      {items.length == 0 && (
        <div className="p-2 flex justify-center mb-6">No Items</div>
      )}

      <Button
        onClick={async () => {
          const newItem: Item = {
            name: "Unnamed",
          };

          const response = await fetch("/api/items/add", {
            method: "POST",
            body: JSON.stringify(newItem),
            headers: { "Content-Type": "application/json" },
          });

          if (response.ok) {
            loadItems();
          }
        }}
      >
        Add Item
      </Button>
    </div>
  );
}
