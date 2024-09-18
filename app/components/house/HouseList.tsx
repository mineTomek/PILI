import { faClone, faEye, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import GenericList from "../GenericList";
import { useRouter } from "next/navigation";
import House from "@/utils/structures/House";

export default function HouseList() {
  const router = useRouter();
  return (
    <GenericList<House>
      dataType="house"
      defaultNewItem={{ name: "Unnamed" }}
      columns={[
        { name: "Name", accessor: (house) => house.name },
        {
          name: "Address",
          accessor: (house) => house.address ?? "No Address",
        },
      ]}
      keyAccessor={(house) => house.id!}
      actions={(loadData) => [
        {
          icon: faTrashCan,
          action: async (house) => {
            const response = await fetch(`/api/house/delete/${house.id}`, {
              method: "DELETE",
            });

            if (response.ok) {
              loadData();
            }
          },
        },
        {
          icon: faClone,
          action: async (house) => {
            const clonedHouse: House = {
              name: house.name,
              address: house.address,
            };
            const response = await fetch("/api/house/add", {
              method: "POST",
              body: JSON.stringify(clonedHouse),
              headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
              loadData();
            }
          },
        },
        {
          icon: faEye,
          action: (house) => router.push(`/house/${house.id}`),
        },
      ]}
      sortingFn={(a, b) => (b.creation_time ?? 0) - (a.creation_time ?? 0)}
    />
  );
}
