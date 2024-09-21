import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import Session from "@/utils/structures/Session";
import DataObject from "@/utils/structures/DataObject";
import { allowedTypes } from "@/utils/allowedDataTypes";

export async function GET(
  _request: Request,
  { params }: { params: { type: string; id: string } }
) {
  if (!allowedTypes.includes(params.type)) {
    return NextResponse.json({ message: "Invalid type" }, { status: 400 });
  }

  const entriesFilePath = path.join(process.cwd(), "data", "history", `${params.type}.json`);
  const entriesData = fs.readFileSync(entriesFilePath, "utf8");
  const entries: HistoryEntry<DataObject>[] = JSON.parse(entriesData);
  const entry = entries.find((i) => i.id === params.id);

  if (!entry) {
    return NextResponse.json({ message: "Object not found" }, { status: 404 });
  }

  const sessionsFilePath = path.join(process.cwd(), "data", "sessions.json");
  const sessionsData = fs.readFileSync(sessionsFilePath, "utf8");
  const sessions: Session[] = JSON.parse(sessionsData);
  const session = sessions.find(
    (s) => s.id_list.indexOf(entry.author_id!) != -1
  );

  entry.author_session_name = session?.name ?? "Unknown ID";

  return NextResponse.json({ entry });
}
