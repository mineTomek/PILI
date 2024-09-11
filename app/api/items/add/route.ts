import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import Item from "@/utils/structures/Item";

export async function POST(request: Request) {
  const newItem: Item = await request.json();

  const filePath = path.join("data", "items.json");
  const data = fs.readFileSync(filePath, "utf8");
  const items: Item[] = JSON.parse(data);

  // If no ID is provided, generate a new UUID
  if (!newItem.id) {
    newItem.id = uuid();
  }

  const existingItem = items.find((item) => item.id === newItem.id);
  if (existingItem) {
    return NextResponse.json(
      { message: `Item with ID ${newItem.id} already exists.` },
      { status: 400 }
    );
  }

  items.push(newItem);

  fs.writeFileSync(filePath, JSON.stringify(items, null, 2), "utf8");

  return NextResponse.json({ message: "Item added successfully", newItem });
}
