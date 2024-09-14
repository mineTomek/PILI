"use client";

import Storage from "@/utils/structures/Storage";
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

export default function ItemModal(props: { item: Storage }) {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [storage, setStorage] = useState<Storage>(props.item);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setStorage((prevItem) => ({
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
    let updatedData: Storage = {
      name: processInput(storage.name) ?? "Unnamed",
      type: processInput(storage.type),
      group: processInput(storage.group)
    };

    fetch(`/api/storages/edit/${storage.id}`, {
      method: "PATCH",
      body: JSON.stringify(updatedData),
    })
      .then((r) => r.json().then((data) => setStorage(data.updatedItem)))
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
            defaultValue={storage.name}
            placeholder="Name..."
          />

          <input
            type="text"
            name="type"
            className="w-max bg-transparent"
            onChange={handleChange}
            defaultValue={storage.type}
            placeholder="Type..."
          />

          <input
            type="text"
            name="group"
            className="w-max bg-transparent"
            onChange={handleChange}
            defaultValue={storage.group}
            placeholder="Group..."
          />
        </>
      ) : (
        <>
          <h2 className="font-bold">{storage.name}</h2>

          <h3 className="text-slate-600 font-light tracking-wide">
            {storage.type}
          </h3>

          <p>{storage.group}</p>
        </>
      )}
      <span className="text-slate-400 text-sm font-light">
        Item ID: {storage.id}
      </span>
      <span className="text-slate-400 text-sm font-light">
        Author ID: {storage.author_id}
      </span>
      <span className="text-slate-400 text-sm font-light">
        Author Session Name: {storage.author_session_name}
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
            fetch(`/api/storages/delete/${storage.id}`, { method: "DELETE" });
            router.push("/");
          }}
        >
          <FontAwesomeIcon icon={faTrashCan} />
        </Button>
      </div>
    </div>
  );
}
