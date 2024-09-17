"use client";

import Item from "@/utils/structures/Item";
import Storage from "@/utils/structures/Storage";
import GenericModal, { EditableItemProperty } from "../GenericModal";

export default function ItemModal(props: {
  item: Item;
  storageList: Storage[];
}) {
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
      placeholder: "Category Name...",
    },
    {
      name: "description",
      type: "textarea",
      accessor: (item) => item.description,
    },
    {
      name: "storage_id",
      type: "dropdown",
      accessor: (item) => item.storage_id,
      placeholder: "Storage ID...",
      dropdownOptions: [
        { value: undefined, name: "None" },
        ...props.storageList
          .filter((item) => item.id)
          .map((item) => {
            return { value: item.id!, name: item.name };
          }),
      ],
    },
  ];

  return (
    <GenericModal
      dataType="item"
      item={props.item}
      properties={modalProps}
      updateData={(item) => ({
        name: processInput(item.name) ?? "Unnamed",
        category: processInput(item.category),
        description: processInput(item.description),
        storage_id: item.storage_id
      })}
    />
  );
}
