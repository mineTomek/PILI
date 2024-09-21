"use client";

import DataObject from "@/utils/structures/DataObject";
import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCancel,
  faChevronDown,
  faEdit,
  faFilePen,
  faFolderPlus,
  faSave,
  faTrashCan,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
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

  const [historyVisible, setHistoryVisible] = useState(false);

  const [historyEntries, setHistoryEntries] = useState<
    HistoryEntry<DataObject>[]
  >([]);

  const router = useRouter();

  const [item, setItem] = useState<T>(props.item);

  useEffect(() => {
    if (historyVisible && historyEntries.length === 0) {
      fetch(`/api/${props.dataType}/history/get?item_id=${item.id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(
              `Got a non-2xx (${res.status}) response while fetching history`
            );
          }
          return res.json();
        })
        .then((data) => setHistoryEntries(data.entries))
        .catch((error) => console.error("Error fetching history:", error));
    }
  }, [historyVisible, historyEntries, item.id, props.dataType]);

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
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `Got a non-2xx (${res.status}) response while saving item`
          );
        }
        return res.json();
      })
      .then((data) => setItem(data.updatedItem))
      .catch((error) => console.error("Error saving item:", error))
      .finally(() => {
        setLoading(false);
        setEditMode(false);
      });
  };

  return (
    <div className="flex flex-col gap-3 relative p-3 size-full m-3 rounded-xl shadow-md bg-zinc-100 dark:bg-zinc-800">
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
                <p className="text-zinc-500 dark:text-zinc-400 text-xs font-light tracking-wide">
                  {prop.name.toUpperCase().replaceAll("_", " ")}
                </p>
                {input}
              </div>
            );
          })}
        </>
      ) : (
        <>
          {props.properties.map((prop) => {
            const propValue = prop.accessor(item);

            if (!propValue) return;

            return (
              <div key={prop.name}>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs font-light tracking-wide">
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
            );
          })}
        </>
      )}

      <div>
        <p className="text-zinc-500 dark:text-zinc-400 text-xs font-light tracking-wide">
          DETAILS
        </p>

        <p className="px-3">
          <strong>Item ID:</strong> {item.id}
        </p>
        <p className="px-3">
          <strong>Author:</strong> {item.author_session_name} ({item.author_id})
        </p>
        <p className="px-3">
          <strong>Creation Time:</strong>{" "}
          {item.creation_time && new Date(item.creation_time).toISOString()}
        </p>
      </div>

      <p className="mt-4" onClick={() => setHistoryVisible((prev) => !prev)}>
        History{" "}
        <FontAwesomeIcon
          icon={faChevronDown}
          className={mergeCss(
            "transition-transform",
            historyVisible && "rotate-180"
          )}
        />
      </p>
      <div className={historyVisible ? "block" : "hidden"}>
        {historyEntries.length > 0 ? (
          <div className="flex flex-col gap-2 mt-3">
            {historyEntries
              .toSorted((a, b) => b.timestamp - a.timestamp)
              .map((entry) => {
                const formatChanges = (
                  previousState: Record<string, any>,
                  currentState: Record<string, any>
                ) => {
                  const changes: JSX.Element[] = [];

                  for (const key in currentState) {
                    if (currentState[key] !== previousState[key]) {
                      changes.push(
                        <p>
                          <strong>{key.replace(/_/g, " ")}</strong> changed from{" "}
                          <i>{'"' + previousState[key] + '"'}</i> to{" "}
                          <i>{'"' + currentState[key] + '"'}</i>
                        </p>
                      );
                    }
                  }

                  return changes;
                };

                const findPreviousEntry = () => {
                  const currentEntryTimestamp = entry.timestamp;

                  const previousEntries = historyEntries.filter(
                    (e) => e.timestamp < currentEntryTimestamp
                  );

                  const sortedEntries = previousEntries.sort(
                    (a, b) => b.timestamp - a.timestamp
                  );

                  const previousEntry =
                    sortedEntries.length > 0 ? sortedEntries[0] : null;

                  return previousEntry;
                };

                const customTags = entry.tags.filter(
                  (tag) =>
                    tag !== "created" && tag !== "deleted" && tag !== "edited"
                );

                let content: JSX.Element | JSX.Element[] = Object.entries(
                  entry.state
                ).map(([key, value]) => (
                  <div key={key}>
                    <p>
                      <strong>{key.replace(/_/g, " ")}: </strong>{" "}
                      {String(value)}
                    </p>
                  </div>
                ));

                if (entry.tags.includes("edited")) {
                  const previousEntry = findPreviousEntry();

                  content = previousEntry ? (
                    formatChanges(previousEntry.state, entry.state).map(
                      (change, index) => <div key={index}>{change}</div>
                    )
                  ) : (
                    <div>No previous changes found for this entry</div>
                  );
                }

                return (
                  <div
                    key={entry.id}
                    className="bg-zinc-200 dark:bg-zinc-700 p-2 rounded-lg relative"
                  >
                    <div className="flex flex-col absolute top-3 left-3 gap-3">
                      {entry.tags.map((tag) => {
                        let className = "text-yellow-500 bg-yellow-50 dark:bg-yellow-800";
                        let icon = faTriangleExclamation;

                        if (tag === "created") {
                          className = "text-green-500 bg-green-50 dark:bg-green-800";
                          icon = faFolderPlus;
                        }

                        if (tag === "edited") {
                          className = "text-sky-500 bg-sky-50 dark:bg-sky-800";
                          icon = faFilePen;
                        }

                        if (tag === "deleted") {
                          className = "text-red-500 bg-red-50 dark:bg-red-800";
                          icon = faTrashCan;
                        }

                        return (
                          <FontAwesomeIcon
                            key={`${tag}-tag-${entry.id}`}
                            icon={icon}
                            className={mergeCss(
                              "w-[1em] p-2 rounded-md shadow-md",
                              className
                            )}
                          />
                        );
                      })}
                    </div>

                    <p
                      className={mergeCss(
                        "text-sm text-zinc-700 dark:text-zinc-200 ml-12"
                      )}
                    >
                      <strong>Timestamp:</strong>{" "}
                      {new Date(entry.timestamp).toLocaleString()}
                    </p>
                    <p
                      className={mergeCss(
                        "text-sm text-zinc-700 dark:text-zinc-200 ml-12"
                      )}
                    >
                      <strong>Author:</strong> {entry.author_session_name} (
                      {entry.author_id})
                    </p>
                    {customTags.length > 0 && (
                      <p
                        className={mergeCss(
                          "text-sm text-zinc-700 dark:text-zinc-200 ml-12"
                        )}
                      >
                        <strong>Tags:</strong> {customTags.join(", ")}
                      </p>
                    )}
                    <div
                      className={mergeCss(
                        "text-sm text-zinc-700 dark:text-zinc-200 ml-12"
                      )}
                    >
                      <strong>State:</strong>{" "}
                      <div className="ml-1 pl-2 border-l-2 border-zinc-400">
                        {content}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No history entries available.
          </p>
        )}
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
