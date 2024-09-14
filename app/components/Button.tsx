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
        "p-3 rounded-lg shadow-sm disabled:text-slate-700 bg-slate-300 disabled:bg-slate-200",
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
