"use client";

import DataObject from "@/utils/structures/DataObject";
import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCancel,
  faEdit,
  faSave,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { mergeCss } from "@/utils/mergeCss";

export type EditableItemProperty<T> = {
  name: string;
  placeholder?: string;
  type: "text" | "textarea" | "number";
  style?: string;
  accessor: (item: T) => string | undefined;
  header?: boolean;
};

export default function GenericModal<T extends DataObject>(props: {
  dataType: string;
  item: T;
  properties: EditableItemProperty<T>[];
  updateData: (item: T) => Partial<T>;
}) {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [item, setItem] = useState<T>(props.item);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const saveEdits = () => {
    setLoading(true);
    let updatedData = props.updateData(item);

    fetch(`/api/${props.dataType}/edit/${item.id}`, {
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
          {props.properties.map((prop) => {
            console.log(prop);

            return prop.type === "textarea" ? (
              <textarea
                key={"editable_" + prop.name}
                name={prop.name}
                className={mergeCss(
                  "w-max bg-transparent",
                  prop.header && "font-bold",
                  prop.style
                )}
                onChange={handleChange}
                defaultValue={prop.accessor(item)}
                placeholder={prop.placeholder}
              />
            ) : (
              <input
                key={"editable_" + prop.name}
                type={prop.type}
                name={prop.name}
                className={mergeCss(
                  "w-max bg-transparent",
                  prop.header && "font-bold",
                  prop.style
                )}
                onChange={handleChange}
                defaultValue={prop.accessor(item)}
                placeholder={prop.placeholder}
              />
            );
          })}
        </>
      ) : (
        <>
          {props.properties.map((prop) => (
            <p
              key={prop.name}
              className={mergeCss(prop.header && "font-bold", prop.style)}
            >
              {prop.accessor(item)}
            </p>
          ))}
        </>
      )}

      <span className="text-slate-400 text-sm font-light">
        Item ID: {item.id}
      </span>
      <span className="text-slate-400 text-sm font-light">
        Author ID: {item.author_id}
      </span>
      <span className="text-slate-400 text-sm font-light">
        Author Session Name: {item.author_session_name}
      </span>
      {item.creation_time && (
        <span className="text-slate-400 text-sm font-light">
          Creation Time: {new Date(item.creation_time).toISOString()}
        </span>
      )}

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
            fetch(`/api/${props.dataType}/delete/${item.id}`, {
              method: "DELETE",
            });
            router.push("/");
          }}
        >
          <FontAwesomeIcon icon={faTrashCan} />
        </Button>
      </div>
    </div>
  );
}
