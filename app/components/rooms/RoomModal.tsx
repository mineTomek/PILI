"use client";

import House from "@/utils/structures/House";
import GenericModal, { EditableItemProperty } from "../GenericModal";
import Room from "@/utils/structures/Room";

export default function RoomModal(props: {
  item: Room;
  houseList: House[];
}) {
  const processInput = (value: string | undefined): string | undefined => {
    const trimmedValue = value?.trim();
    return trimmedValue?.length ? trimmedValue : undefined;
  };

  const modalProps: EditableItemProperty<Room>[] = [
    {
      name: "name",
      type: "text",
      accessor: (storage) => storage.name,
      header: true,
    },
    {
      name: "house_id",
      type: "dropdown",
      accessor: (item) => item.house_id,
      placeholder: "House ID...",
      dropdownOptions: [
        { value: undefined, name: "None" },
        ...props.houseList
          .filter((item) => item.id)
          .map((item) => {
            return { value: item.id!, name: item.name };
          }),
      ],
    },
  ];

  return (
    <GenericModal
      dataType="room"
      item={props.item}
      properties={modalProps}
      updateData={(room) => ({
        name: processInput(room.name) ?? "Unnamed",
        house_id: room.house_id,
      })}
    />
  );
}
