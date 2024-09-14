import { faClone, faEye, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import GenericList from "../GenericList";
import Storage from "@/utils/structures/Storage";
import { useRouter } from "next/navigation";

export default function StorageList() {
  const router = useRouter();
  return (
    <GenericList<Storage>
      dataType="storages"
      defaultNewItem={{ name: "Unnamed" }}
      columns={[
        { name: "Name", accessor: (storage) => storage.name },
        { name: "Group", accessor: (storage) => storage.group ?? "No Group" },
        { name: "Type", accessor: (storage) => storage.type ?? "No Type" },
      ]}
      keyAccessor={(storage) => storage.id!}
      actions={(loadData) => [
        {
          icon: faTrashCan,
          action: async (storage) => {
            const response = await fetch(`/api/storages/delete/${storage.id}`, {
              method: "DELETE",
            });

            if (response.ok) {
              loadData();
            }
          },
        },
        {
          icon: faClone,
          action: async (storage) => {
            const clonedStorage: Storage = {
              name: storage.name,
              group: storage.group,
              level: storage.level,
              type: storage.type,
              room_id: storage.room_id,
              surfacePosition: storage.surfacePosition,
            };
            const response = await fetch("/api/storages/add", {
              method: "POST",
              body: JSON.stringify(clonedStorage),
              headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
              loadData();
            }
          },
        },
        {
          icon: faEye,
          action: (storage) => router.push(`/storage/${storage.id}`),
        },
      ]}
    />
  );
}
