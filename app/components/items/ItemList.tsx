import { faClone, faEye, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import GenericList from "../GenericList";
import Item from "@/utils/structures/Item";
import { useRouter } from "next/navigation";

export default function ItemList() {
  const router = useRouter();
  return (
    <GenericList<Item>
      dataType="item"
      defaultNewItem={{ name: "Unnamed" }}
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
      actions={(loadData) => [
        {
          icon: faTrashCan,
          action: async (item) => {
            const response = await fetch(`/api/item/delete/${item.id}`, {
              method: "DELETE",
            });

            if (response.ok) {
              loadData();
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
            const response = await fetch("/api/item/add", {
              method: "POST",
              body: JSON.stringify(clonedItem),
              headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
              loadData();
            }
          },
        },
        {
          icon: faEye,
          action: (item) => router.push(`/item/${item.id}`),
        },
      ]}
      sortingFn={(a, b) => (b.creation_time ?? 0) - (a.creation_time ?? 0)}
    />
  );
}
