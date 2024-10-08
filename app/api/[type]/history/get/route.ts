import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import Session from "@/utils/structures/Session";
import DataObject from "@/utils/structures/DataObject";
import { allowedTypes } from "@/utils/allowedDataTypes";
// import Fuse, { IFuseOptions } from "fuse.js";

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  if (!allowedTypes.includes(params.type)) {
    return NextResponse.json({ message: "Invalid type" }, { status: 400 });
  }

  const filePath = path.join("data", "history", `${params.type}.json`);
  const data = fs.readFileSync(filePath, "utf8");
  let entries: HistoryEntry<DataObject>[] = JSON.parse(data);

  const sessionsFilePath = path.join(process.cwd(), "data", "sessions.json");
  const sessionsData = fs.readFileSync(sessionsFilePath, "utf8");
  const sessions: Session[] = JSON.parse(sessionsData);

  const itemId = request.nextUrl.searchParams.get("item_id");

  if (itemId) {
    entries = entries.filter(entry => (entry.modified_object_id === itemId))
  }

  const getSessionName = (entry: HistoryEntry<DataObject>) =>
    sessions.find((s) => s.id_list.indexOf(entry.author_id!) != -1);

  const entriesWithSessionName = entries.map((entry) => ({
    ...entry,
    author_session_name: getSessionName(entry)?.name ?? "Unknown ID",
  }));

  //   const searchQuery = request.nextUrl.searchParams.get("q");

  //   if (!searchQuery) {
  return NextResponse.json({ entries: entriesWithSessionName });
  //   }

  //   const fuseOptions: IFuseOptions<DataObject> = {
  //     keys: [
  //       { name: "name", weight: 0.6 },
  //       { name: "author_session_name", weight: 0.4 },
  //     ],
  //     threshold: 0.3, // Lower threshold = stricter match
  //   };

  //   const fuse = new Fuse(entriesWithSessionName, fuseOptions);

  //   const result = fuse.search(searchQuery);

  //   const filteredItems = result.map(({ item }) => item);

  //   return NextResponse.json({ entries: filteredItems });
}
