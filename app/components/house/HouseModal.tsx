"use client";

import House from "@/utils/structures/House";
import GenericModal, { EditableItemProperty } from "../GenericModal";

export default function HouseModal(props: { item: House }) {
  const processInput = (value: string | undefined): string | undefined => {
    const trimmedValue = value?.trim();
    return trimmedValue?.length ? trimmedValue : undefined;
  };

  const modalProps: EditableItemProperty<House>[] = [
    {
      name: "name",
      type: "text",
      accessor: (house) => house.name,
      header: true,
    },
    {
      name: "address",
      type: "text",
      accessor: (house) => house.address,
    },
  ];

  return (
    <GenericModal
      dataType="house"
      item={props.item}
      properties={modalProps}
      updateData={(house) => ({
        name: processInput(house.name) ?? "Unnamed",
        address: processInput(house.address),
      })}
    />
  );
}
