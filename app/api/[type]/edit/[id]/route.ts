import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import DataObject from "@/utils/structures/DataObject";
import { allowedTypes } from "@/utils/allowedDataTypes";
import addHistoryEntry from "@/utils/addHistoryEntry";
import { v4 as uuid } from "uuid";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { type: string; id: string } }
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

  let deviceToken = request.cookies.get("device-token")?.value;

  if (!deviceToken) {
    deviceToken = uuid();
  }

  addHistoryEntry(params.type, {
    id: uuid(),
    modified_object_id: itemId,
    author_id: deviceToken,
    timestamp: Date.now(),
    state: items[itemIndex],
    tags: [],
  });

  const response = NextResponse.json({
    message: "Object updated successfully",
    updatedItem,
  });

  response.cookies.set("device-token", deviceToken, {
    httpOnly: true,
    // secure: true, // cookies HTTP addresses with secure=true are not saved
    maxAge: 60 * 60 * 24 * 365, // 1 year expiration
  });

  return response;
}
