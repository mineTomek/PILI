import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import Item from "../../../../utils/structures/Item";

export async function GET() {
  //   const filePath = path.join(process.cwd(), "data", "items.json");

  const filePath = path.join("data", "items.json");
  const data = fs.readFileSync(filePath, "utf8");
  const items: Item[] = JSON.parse(data);
  return NextResponse.json(items);
}
