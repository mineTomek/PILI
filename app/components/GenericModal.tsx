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
    <div className="flex flex-col gap-3 relative p-3 size-full m-3 rounded-xl shadow-md bg-slate-100">
      {editMode ? (
        <>
          {props.properties.map((prop) => {
            let input: JSX.Element | undefined = undefined;

            switch (prop.type) {
              case "textarea":
                input = (
                  <textarea
                    name={prop.name}
                    className={mergeCss(
                      "w-max bg-transparent rounded-xl px-3",
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
                break;
              case "dropdown":
                input = (
                  <div className="relative w-max .transform .-translate-x-3">
                    <select
                      name={prop.name}
                      className={mergeCss(
                        "w-max px-3 rounded-xl appearance-none relative bg-transparent pr-8",
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
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none"
                    />
                  </div>
                );
                break;
              default:
                input = (
                  <input
                    type={prop.type}
                    name={prop.name}
                    className={mergeCss(
                      "w-max bg-transparent rounded-xl px-3",
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
                break;
            }

            return (
              <div key={"editable_" + prop.name}>
                <p className="text-slate-500 text-xs font-light tracking-wide">
                  {prop.name.toUpperCase().replaceAll("_", " ")}
                </p>
                {input}
              </div>
            );
          })}
        </>
      ) : (
        <>
          {props.properties.map((prop) => (
            <div key={prop.name}>
              <p className="text-slate-500 text-xs font-light tracking-wide">
                {prop.name.toUpperCase().replaceAll("_", " ")}
              </p>
              <p
                className={mergeCss(
                  "px-3",
                  prop.header && "font-bold",
                  prop.style
                )}
              >
                {prop.accessor(item)}
              </p>
            </div>
          ))}
        </>
      )}

      <p className="mt-4" onClick={() => setDetails((prev) => !prev)}>
        Details{" "}
        <FontAwesomeIcon
          icon={faChevronDown}
          className={mergeCss("transition-transform", details && "rotate-180")}
        />
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
