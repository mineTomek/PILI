import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import Session from "@/utils/structures/Session";
import DataObject from "@/utils/structures/DataObject";

export async function GET(_request: Request, { params }: { params: { type: string } }) {
  const filePath = path.join("data", `${params.type}.json`);
  const data = fs.readFileSync(filePath, "utf8");
  const items: DataObject[] = JSON.parse(data);

  const sessionsFilePath = path.join(process.cwd(), "data", "sessions.json");
  const sessionsData = fs.readFileSync(sessionsFilePath, "utf8");
  const sessions: Session[] = JSON.parse(sessionsData);

  const getSessionName = (item: DataObject) =>
    sessions.find((s) => s.id_list.indexOf(item.author_id!) != -1);

  const itemsWithSessionName = items.map((item) => ({
    ...item,
    author_session_name: getSessionName(item)?.name ?? "Unknown ID",
  }));

  return NextResponse.json({ items: itemsWithSessionName });
}
