import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import DataObject from "@/utils/structures/DataObject";
import { allowedTypes } from "@/utils/allowedDataTypes";

export async function PATCH(
  request: Request,
  { params }: { params: { type: string, id: string } }
) {
  if (!allowedTypes.includes(params.type)) {
    return NextResponse.json({ message: "Invalid type" }, { status: 400 });
  }

  const itemId = params.id;
  const updatedData: Partial<DataObject> = await request.json();

  const filePath = path.join("data", `${params.type}.json`);
  const data = fs.readFileSync(filePath, "utf8");
  const items: DataObject[] = JSON.parse(data);

  const itemIndex = items.findIndex((item) => item.id === itemId);

  if (itemIndex === -1) {
    return NextResponse.json(
      { message: `Object with id ${itemId} not found` },
      { status: 404 }
    );
  }

  const updatedItem = { ...items[itemIndex], ...updatedData };

  items[itemIndex] = updatedItem;

  fs.writeFileSync(filePath, JSON.stringify(items, null, 2), "utf8");

//   // Artificial delay
//   await new Promise((resolve) => setTimeout(resolve, 2000));

  return NextResponse.json({
    message: "Object updated successfully",
    updatedItem,
  });
}
