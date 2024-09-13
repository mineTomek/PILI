"use client";

import { useEffect, useState } from "react";
import Button from "../Button";
import { useRouter } from "next/navigation";
import Loading from "../Loading";
import Item from "@/utils/structures/Item";

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      const response = await fetch("/api/items/get");
      const loadedItems: Item[] = await response.json();
      setItems(loadedItems);
      setLoading(false);
    };

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
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="cursor-pointer even:bg-slate-50 hover:bg-slate-100 transition-colors divide-x divide-slate-100"
              onClick={e => router.push(`/item/${item.id}`)}
            >
              <td className="p-2">{item.name}</td>
              <td className="p-2">{item.category}</td>
              <td className="p-2">{item.storage_id}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Button
        onClick={(_) => {
          fetch("/api/items/add", {
            method: "POST",
            body: '{"name": "Test", "category": "Tests", "storage_id": "0"}',
          });
          router.refresh();
        }}
      >
        Add Item
      </Button>
    </div>
  );
}
