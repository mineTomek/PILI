"use client";

import DataObject from "@/utils/structures/DataObject";
import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCancel,
  faChevronDown,
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
  type: "text" | "textarea" | "number" | "dropdown";
  style?: string;
  accessor: (item: T) => string | undefined;
  header?: boolean;
  dropdownOptions?: { value: string | number | undefined; name: string }[];
};

export default function GenericModal<T extends DataObject>(props: {
  dataType: string;
  item: T;
  properties: EditableItemProperty<T>[];
  updateData: (item: T) => Partial<T>;
}) {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [details, setDetails] = useState(false);

  const router = useRouter();

  const [item, setItem] = useState<T>(props.item);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
            switch (prop.type) {
              case "textarea":
                return (
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
                    placeholder={
                      prop.placeholder ??
                      `${prop.name[0].toUpperCase()}${prop.name
                        .slice(1)
                        .toLowerCase()}...`
                    }
                  />
                );
              case "dropdown":
                return (
                  <select
                    key={"editable_" + prop.name}
                    name={prop.name}
                    className={mergeCss(
                      "w-max .appearance-none px-2 rounded-full bg-transparent",
                      prop.header && "font-bold",
                      prop.style
                    )}
                    onChange={handleChange}
                    defaultValue={prop.accessor(item)}
                  >
                    {prop.dropdownOptions?.map((option) => (
                      <option
                        key={`${prop.name}-option-${option.value}`}
                        value={option.value}
                      >
                        {option.name}
                      </option>
                    ))}
                  </select>
                );

              default:
                return (
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
                    placeholder={
                      prop.placeholder ??
                      `${prop.name[0].toUpperCase()}${prop.name
                        .slice(1)
                        .toLowerCase()}...`
                    }
                  />
                );
            }
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

      <p className="mt-4" onClick={() => setDetails((prev) => !prev)}>
        Details <FontAwesomeIcon icon={faChevronDown} className={mergeCss("transition-transform", details && "rotate-180")} />
      </p>
      <div className={details ? "block" : "hidden"}>
        <p className="text-slate-400 text-sm font-light">Item ID: {item.id}</p>
        <p className="text-slate-400 text-sm font-light">
          Author ID: {item.author_id}
        </p>
        <p className="text-slate-400 text-sm font-light">
          Author Session Name: {item.author_session_name}
        </p>
        <p className="text-slate-400 text-sm font-light">
          Creation Time:{" "}
          {item.creation_time && new Date(item.creation_time).toISOString()}
        </p>
      </div>

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
