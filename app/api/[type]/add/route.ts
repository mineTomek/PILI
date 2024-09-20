import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";
import DataObject from "@/utils/structures/DataObject";
import { NextRequest, NextResponse } from "next/server";
import { allowedTypes } from "@/utils/allowedDataTypes";
import addHistoryEntry from "@/utils/addHistoryEntry";

export async function POST(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  if (!allowedTypes.includes(params.type)) {
    return NextResponse.json({ message: "Invalid type" }, { status: 400 });
  }

  let newItem: DataObject;

  try {
    newItem = await request.json();
  } catch (error: any) {
    return NextResponse.json(
      { message: "Invalid JSON body", error: error.message },
      { status: 400 }
    );
  }

  if (!newItem) {
    return NextResponse.json(
      { message: "Request body cannot be empty" },
      { status: 400 }
    );
  }

  let deviceToken = request.cookies.get("device-token")?.value;

  if (!deviceToken) {
    deviceToken = uuid();
  }

  newItem.author_id = deviceToken;

  const filePath = path.join("data", `${params.type}.json`);
  const data = fs.readFileSync(filePath, "utf8");
  const items: DataObject[] = JSON.parse(data);

  if (!newItem.id) {
    newItem.id = uuid();
  }

  newItem.creation_time = Date.now();

  const existingItem = items.find((item) => item.id === newItem.id);
  if (existingItem) {
    return NextResponse.json({
      message: "Object with this ID already exists",
      newItem,
    });
  }

  items.push(newItem);

  fs.writeFileSync(filePath, JSON.stringify(items, null, 2), "utf8");

  addHistoryEntry(params.type, {
    id: uuid(),
    modified_object_id: newItem.id,
    author_id: deviceToken,
    timestamp: Date.now(),
    state: newItem,
    tags: ["created"],
  });

  const response = NextResponse.json({
    message: "Object added successfully",
    newItem,
  });

  response.cookies.set("device-token", deviceToken, {
    httpOnly: true,
    // secure: true, // cookies HTTP addresses with secure=true are not saved
    maxAge: 60 * 60 * 24 * 365, // 1 year expiration
  });

  return response;
}
