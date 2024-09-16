"use client";

import Item from "@/utils/structures/Item";
import GenericModal, { EditableItemProperty } from "../GenericModal";

export default function ItemModal(props: { item: Item }) {
  const processInput = (value: string | undefined): string | undefined => {
    const trimmedValue = value?.trim();
    return trimmedValue?.length ? trimmedValue : undefined;
  };

  const modalProps: EditableItemProperty<Item>[] = [
    {
      name: "name",
      type: "text",
      accessor: (item) => item.name,
      header: true,
    },
    {
      name: "category",
      type: "text",
      accessor: (item) => item.category,
    },
    {
      name: "description",
      type: "textarea",
      accessor: (item) => item.description,
    },
    {
      name: "storage_id",
      type: "text", // TODO: Something more specific here
      accessor: (item) => item.storage_id,
    },
  ];
  
  return (
    <GenericModal
      dataType="items"
      item={props.item}
      properties={modalProps}
      updateData={(item) => ({
        name: processInput(item.name) ?? "Unnamed",
        category: processInput(item.category),
        description: processInput(item.description)
      })}
    />
  );
}
