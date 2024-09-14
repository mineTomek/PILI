import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import Storage from "@/utils/structures/Storage";
import Session from "@/utils/structures/Session";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const storagesFilePath = path.join(process.cwd(), "data", "storages.json");
  const storagesData = fs.readFileSync(storagesFilePath, "utf8");
  const storages: Storage[] = JSON.parse(storagesData);
  const storage = storages.find((i) => i.id === params.id);

  if (storage) {
    const sessionsFilePath = path.join(process.cwd(), "data", "sessions.json");
    const sessionsData = fs.readFileSync(sessionsFilePath, "utf8");
    const sessions: Session[] = JSON.parse(sessionsData);
    const session = sessions.find(
      (s) => s.id_list.indexOf(storage.author_id!) != -1
    );

    storage.author_session_name = session?.name ?? "Unknown ID";

    return NextResponse.json({ item: storage });
  } else {
    return NextResponse.json({ message: "Item not found" }, { status: 404 });
  }
}
