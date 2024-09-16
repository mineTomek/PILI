import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import DataObject from "@/utils/structures/DataObject";
import { allowedTypes } from "@/utils/allowedDataTypes";

export async function DELETE(
  request: Request,
  { params }: { params: { type: string, id: string } }
) {
  if (!allowedTypes.includes(params.type)) {
    return NextResponse.json({ message: "Invalid type" }, { status: 400 });
  }

  const filePath = path.join("data", `${params.type}.json`);
  const data = fs.readFileSync(filePath, "utf8");
  let items: DataObject[] = JSON.parse(data);

  const itemIndex = items.findIndex((i) => i.id === params.id);

  if (itemIndex > -1) {
    const removedItem = items.splice(itemIndex, 1);
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2), "utf8");
    return NextResponse.json({
      message: "Object removed successfully",
      item: removedItem,
    });
  } else {
    return NextResponse.json({ message: "Object not found" }, { status: 404 });
  }
}
