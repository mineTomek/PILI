import { faClone, faEye, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import GenericList from "../GenericList";
import { useRouter } from "next/navigation";
import Room from "@/utils/structures/Room";

export default function RoomList(props: { refreshKey: number }) {
  const router = useRouter();
  return (
    <GenericList<Room>
      refreshKey={props.refreshKey}
      dataType="room"
      defaultNewItem={{ name: "Unnamed" }}
      columns={[
        { name: "Name", accessor: (room) => room.name },
        {
          name: "House ID",
          accessor: (room) => room.house_id ?? "No House ID",
        },
      ]}
      keyAccessor={(room) => room.id!}
      actions={(loadData) => [
        {
          icon: faTrashCan,
          action: async (room) => {
            const response = await fetch(`/api/room/delete/${room.id}`, {
              method: "DELETE",
            });

            if (response.ok) {
              loadData();
            }
          },
        },
        {
          icon: faClone,
          action: async (room) => {
            const clonedRoom: Room = {
              name: room.name,
              house_id: room.house_id,
            };
            const response = await fetch("/api/room/add", {
              method: "POST",
              body: JSON.stringify(clonedRoom),
              headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
              loadData();
            }
          },
        },
        {
          icon: faEye,
          action: (room) => router.push(`/room/${room.id}`),
        },
      ]}
      sortingFn={(a, b) => (b.creation_time ?? 0) - (a.creation_time ?? 0)}
    />
  );
}
