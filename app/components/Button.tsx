"use client"

import { mergeCss } from "@/utils/mergeCss";

export type OnClickAction = (event: any) => void;

export default function Button(props: {
  children: string | JSX.Element | JSX.Element[];
  className?: string;
  disabled?: boolean;
  onClick?: OnClickAction;
}) {
  return (
    <button
      className={mergeCss(
        "p-3 rounded-lg shadow-sm disabled:text-zinc-700 dark:disabled:text-zinc-500 bg-zinc-300 dark:bg-zinc-700 disabled:bg-zinc-200 dark:disabled:bg-zinc-800",
        props.className
      )}
      disabled={props.disabled}
      onClick={(e) => {
        if (props.onClick) props.onClick(e);
      }}
    >
      {props.children}
    </button>
  );
}
