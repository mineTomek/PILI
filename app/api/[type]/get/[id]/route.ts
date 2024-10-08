import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import DataObject from "@/utils/structures/DataObject";
import Session from "@/utils/structures/Session";
import { allowedTypes } from "@/utils/allowedDataTypes";

export async function GET(
  _request: Request,
  { params }: { params: { type: string; id: string } }
) {
  if (!allowedTypes.includes(params.type)) {
    return NextResponse.json({ message: "Invalid type" }, { status: 400 });
  }

  const itemsFilePath = path.join(process.cwd(), "data", `${params.type}.json`);
  const itemsData = fs.readFileSync(itemsFilePath, "utf8");
  const items: DataObject[] = JSON.parse(itemsData);
  const item = items.find((i) => i.id === params.id);

  if (!item) {
    return NextResponse.json({ message: "Object not found" }, { status: 404 });
  }
  
  const sessionsFilePath = path.join(process.cwd(), "data", "sessions.json");
  const sessionsData = fs.readFileSync(sessionsFilePath, "utf8");
  const sessions: Session[] = JSON.parse(sessionsData);
  const session = sessions.find(
    (s) => s.id_list.indexOf(item.author_id!) != -1
  );

  item.author_session_name = session?.name ?? "Unknown ID";

  return NextResponse.json({ item });
}
