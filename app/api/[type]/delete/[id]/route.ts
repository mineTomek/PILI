import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import DataObject from "@/utils/structures/DataObject";
import { allowedTypes } from "@/utils/allowedDataTypes";
import addHistoryEntry from "@/utils/addHistoryEntry";
import { v4 as uuid } from "uuid";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { type: string; id: string } }
) {
  if (!allowedTypes.includes(params.type)) {
    return NextResponse.json({ message: "Invalid type" }, { status: 400 });
  }

  const filePath = path.join("data", `${params.type}.json`);
  const data = fs.readFileSync(filePath, "utf8");
  let items: DataObject[] = JSON.parse(data);

  const itemIndex = items.findIndex((i) => i.id === params.id);

  if (itemIndex == -1) {
    return NextResponse.json({ message: "Object not found" }, { status: 404 });
  }

  const removedItem = items.splice(itemIndex, 1);
  fs.writeFileSync(filePath, JSON.stringify(items, null, 2), "utf8");

  let deviceToken = request.cookies.get("device-token")?.value;

  if (!deviceToken) {
    deviceToken = uuid();
  }

  addHistoryEntry(params.type, {
    id: uuid(),
    modified_object_id: removedItem[0].id!,
    author_id: deviceToken,
    timestamp: Date.now(),
    state: items[itemIndex],
    tags: ["deleted"],
  });

  const response = NextResponse.json({
    message: "Object removed successfully",
    item: removedItem,
  });

  response.cookies.set("device-token", deviceToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365, // 1 year expiration
  });

  return response;
}
