import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import Item from "@/utils/structures/Item";
import Session from "@/utils/structures/Session";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const itemsFilePath = path.join(process.cwd(), "data", "items.json");
  const itemsData = fs.readFileSync(itemsFilePath, "utf8");
  const items: Item[] = JSON.parse(itemsData);
  const item = items.find((i) => i.id === params.id);

  if (item) {
    const sessionsFilePath = path.join(process.cwd(), "data", "sessions.json");
    const sessionsData = fs.readFileSync(sessionsFilePath, "utf8");
    const sessions: Session[] = JSON.parse(sessionsData);
    const session = sessions.find(
      (s) => s.id_list.indexOf(item.author_id!) != -1
    );

    item.author_session_name = session?.name ?? "Unknown ID";

    return NextResponse.json({ item });
  } else {
    return NextResponse.json({ message: "Item not found" }, { status: 404 });
  }
}
