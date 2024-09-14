import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import Item from "../../../../utils/structures/Item";
import Session from "@/utils/structures/Session";

export async function GET() {
  const filePath = path.join("data", "items.json");
  const data = fs.readFileSync(filePath, "utf8");
  const items: Item[] = JSON.parse(data);

  const sessionsFilePath = path.join(process.cwd(), "data", "sessions.json");
  const sessionsData = fs.readFileSync(sessionsFilePath, "utf8");
  const sessions: Session[] = JSON.parse(sessionsData);

  const getSessionName = (item: Item) =>
    sessions.find((s) => s.id_list.indexOf(item.author_id!) != -1);

  const itemsWithSessionName = items.map((item) => ({
    ...item,
    author_session_name: getSessionName(item)?.name ?? "Unknown ID",
  }));

  return NextResponse.json({ items: itemsWithSessionName });
}
