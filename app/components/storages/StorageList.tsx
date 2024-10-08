import { faClone, faEye, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import GenericList from "../GenericList";
import Storage from "@/utils/structures/Storage";
import { useRouter } from "next/navigation";

export default function StorageList(props: { refreshKey: number }) {
  const router = useRouter();
  return (
    <GenericList<Storage>
      refreshKey={props.refreshKey}
      dataType="storage"
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
            const response = await fetch(`/api/storage/delete/${storage.id}`, {
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
            const response = await fetch("/api/storage/add", {
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
      sortingFn={(a, b) => (b.creation_time ?? 0) - (a.creation_time ?? 0)}
    />
  );
}
