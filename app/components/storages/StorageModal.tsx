"use client";

import Storage from "@/utils/structures/Storage";
import GenericModal, { EditableItemProperty } from "../GenericModal";

export default function StorageModal(props: { item: Storage }) {
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
      type: "text", // "choice" when available
      accessor: (storage) => storage.type,
    },
    {
      name: "group",
      type: "text",
      accessor: (storage) => storage.group,
    },
  ];

  return (
    <GenericModal
      dataType="storages"
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
