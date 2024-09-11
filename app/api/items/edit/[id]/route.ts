import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Item from "@/utils/structures/Item";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const itemId = params.id;
  const updatedData: Partial<Item> = await request.json();

  const filePath = path.join("data", "items.json");
  const data = fs.readFileSync(filePath, "utf8");
  const items: Item[] = JSON.parse(data);

  const itemIndex = items.findIndex((item) => item.id === itemId);

  if (itemIndex === -1) {
    return NextResponse.json(
      { message: `Item with id ${itemId} not found` },
      { status: 404 }
    );
  }

  const updatedItem = { ...items[itemIndex], ...updatedData };

  items[itemIndex] = updatedItem;

  fs.writeFileSync(filePath, JSON.stringify(items, null, 2), "utf8");

//   // Artificial delay
//   await new Promise((resolve) => setTimeout(resolve, 2000));

  return NextResponse.json({
    message: "Item updated successfully",
    updatedItem,
  });
}
