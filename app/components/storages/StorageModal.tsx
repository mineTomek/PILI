"use client";

import Storage from "@/utils/structures/Storage";
import GenericModal, { EditableItemProperty } from "../GenericModal";
import Room from "@/utils/structures/Room";

export default function StorageModal(props: {
  item: Storage;
  roomList: Room[];
}) {
  const processInput = (value: string | undefined): string | undefined => {
    const trimmedValue = value?.trim();
    return trimmedValue?.length ? trimmedValue : undefined;
  };

  const modalProps: EditableItemProperty<Storage>[] = [
    {
      name: "name",
      type: "text",
      accessor: (storage) => storage.name,
      header: true,
    },
    {
      name: "type",
      type: "dropdown",
      accessor: (storage) => storage.type,
      dropdownOptions: [
        { value: "desk", name: "Desk" },
        { value: "shelf", name: "Shelf" },
        { value: "drawer", name: "Drawer" },
        { value: "other", name: "Other" },
      ],
    },
    {
      name: "group",
      type: "text",
      accessor: (storage) => storage.group,
    },
    {
      name: "room_id",
      type: "dropdown",
      accessor: (item) => item.room_id,
      placeholder: "Room ID...",
      dropdownOptions: [
        { value: undefined, name: "None" },
        ...props.roomList
          .filter((item) => item.id)
          .map((item) => {
            return { value: item.id!, name: item.name };
          }),
      ],
    },
  ];

  return (
    <GenericModal
      dataType="storage"
      item={props.item}
      properties={modalProps}
      updateData={(storage) => ({
        name: processInput(storage.name) ?? "Unnamed",
        type: processInput(storage.type),
        group: processInput(storage.group),
        level: storage.level,
        room_id: storage.room_id,
        surfacePosition: storage.surfacePosition,
      })}
    />
  );
}
