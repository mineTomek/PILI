"use client";

import Item from "@/utils/structures/Item";
import Button from "../Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import {
  faCancel,
  faSave,
  faEdit,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

export default function ItemModal(props: { item: Item }) {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [item, setItem] = useState<Item>(props.item);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const processInput = (value: string | undefined): string | undefined => {
    const trimmedValue = value?.trim();
    return trimmedValue?.length ? trimmedValue : undefined;
  };

  const saveEdits = () => {
    setLoading(true);
    let updatedData = {
      name: processInput(item.name),
      category: processInput(item.category),
      description: item.description,
    };

    fetch(`/api/items/edit/${item.id}`, {
      method: "PATCH",
      body: JSON.stringify(updatedData),
    })
      .then((r) => r.json().then((data) => setItem(data.updatedItem)))
      .catch((error) => console.error("Error saving item:", error))
      .finally(() => {
        setLoading(false);
        setEditMode(false);
      });
  };

  return (
    <div className="flex flex-col relative p-3 size-full m-3 rounded-xl shadow-md bg-slate-100">
      {editMode ? (
        <>
          <input
            type="text"
            name="name"
            className="w-max bg-transparent"
            onChange={handleChange}
            defaultValue={item.name}
            placeholder="Name..."
          />

          <input
            type="text"
            name="category"
            className="w-max bg-transparent"
            onChange={handleChange}
            defaultValue={item.category}
            placeholder="Category Name..."
          />

          <textarea
            name="description"
            className="w-max bg-transparent"
            onChange={handleChange}
            defaultValue={item.description}
            placeholder="Description..."
          />
        </>
      ) : (
        <>
          <h2 className="font-bold">{item.name}</h2>

          <h3 className="text-slate-600 font-light tracking-wide">
            {item.category}
          </h3>

          <p>{item.description}</p>
        </>
      )}
      <span className="text-slate-400 text-sm font-light">
        Item ID: {item.id}
      </span>

      <div className="absolute top-2 right-2 flex gap-2">
        {editMode && (
          <>
            <Button
              className="size-8 flex justify-center items-center"
              disabled={loading}
              onClick={saveEdits}
            >
              <FontAwesomeIcon icon={faSave} />
            </Button>
            <Button
              className="size-8 flex justify-center items-center"
              disabled={loading}
              onClick={(_) => setEditMode(false)}
            >
              <FontAwesomeIcon icon={faCancel} />
            </Button>
          </>
        )}
        {!editMode && (
          <Button
            className="size-8 flex justify-center items-center"
            onClick={(_) => setEditMode(true)}
          >
            <FontAwesomeIcon icon={faEdit} />
          </Button>
        )}
        <Button
          className="size-8 flex justify-center items-center"
          onClick={(_) => {
            fetch(`/api/items/delete/${item.id}`, { method: "DELETE" });
            router.push("/");
          }}
        >
          <FontAwesomeIcon icon={faTrashCan} />
        </Button>
      </div>
    </div>
  );
}
