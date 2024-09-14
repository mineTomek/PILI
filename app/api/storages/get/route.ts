import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import Storage from "../../../../utils/structures/Storage";
import Session from "@/utils/structures/Session";

export async function GET() {
  const filePath = path.join("data", "storages.json");
  const data = fs.readFileSync(filePath, "utf8");
  const storages: Storage[] = JSON.parse(data);

  const sessionsFilePath = path.join(process.cwd(), "data", "sessions.json");
  const sessionsData = fs.readFileSync(sessionsFilePath, "utf8");
  const sessions: Session[] = JSON.parse(sessionsData);

  const getSessionName = (storage: Storage) =>
    sessions.find((s) => s.id_list.indexOf(storage.author_id!) != -1);

  const storagesWithSessionName = storages.map((storage) => ({
    ...storage,
    author_session_name: getSessionName(storage)?.name ?? "Unknown ID",
  }));

  return NextResponse.json({ items: storagesWithSessionName });
}
