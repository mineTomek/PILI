"use client";

import { useEffect, useState } from "react";
import Button from "../Button";
import { useRouter } from "next/navigation";
import Loading from "../Loading";
import Item from "@/utils/structures/Item";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone, faTrashCan } from "@fortawesome/free-solid-svg-icons";

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const loadItems = async () => {
    setLoading(true);
    const response = await fetch("/api/items/get");
    const loadedItems: Item[] = await response.json();
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
      <table className="w-full mb-6">
        <thead>
          <tr>
            <th className="p-2 border-b">Name</th>
            <th className="p-2 border-b">Category</th>
            <th className="p-2 border-b">Storage</th>
            <th className="p-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="even:bg-slate-50 hover:bg-slate-100 transition-colors divide-x divide-slate-100"
            >
              <td
                className="p-2 cursor-pointer"
                onClick={() => router.push(`/item/${item.id}`)}
              >
                {item.name}
              </td>
              <td className="p-2">{item.category}</td>
              <td className="p-2">{item.storage_id}</td>
              <td className="p-2 flex justify-center gap-2">
                <Button
                  className="size-8 flex justify-center items-center"
                  onClick={async () => {
                    const response = await fetch(
                      `/api/items/delete/${item.id}`,
                      { method: "DELETE" }
                    );

                    if (response.ok) {
                      loadItems();
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </Button>
                <Button
                  className="size-8 flex justify-center items-center"
                  onClick={async () => {
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
                  }}
                >
                  <FontAwesomeIcon icon={faClone} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Button
        onClick={async () => {
          const newItem: Item = {
            name: "Test",
            category: "Tests",
            storage_id: "0",
            description: "Test description",
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
