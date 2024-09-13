import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import Item from "../../../../../utils/structures/Item";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const filePath = path.join(process.cwd(), "data", "items.json");
  const data = fs.readFileSync(filePath, "utf8");
  const items: Item[] = JSON.parse(data);

  const item = items.find((i) => i.id === params.id);

  if (item) {
    return NextResponse.json({item});
  } else {
    return NextResponse.json({ message: "Item not found" }, { status: 404 });
  }
}
