import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import Item from "../../../../../utils/structures/Item";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const filePath = path.join("data", "items.json");
  const data = fs.readFileSync(filePath, "utf8");
  let items: Item[] = JSON.parse(data);

  const itemIndex = items.findIndex((i) => i.id === params.id);

  if (itemIndex > -1) {
    const removedItem = items.splice(itemIndex, 1);
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2), "utf8");
    return NextResponse.json({
      message: "Item removed successfully",
      item: removedItem,
    });
  } else {
    return NextResponse.json({ message: "Item not found" }, { status: 404 });
  }
}
