import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";
import Item from "@/utils/structures/Item";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let newItem: Item;

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

  const filePath = path.join("data", "items.json");
  const data = fs.readFileSync(filePath, "utf8");
  const items: Item[] = JSON.parse(data);

  // If no ID is provided, generate a new UUID
  if (!newItem.id) {
    newItem.id = uuid();
  }

  const existingItem = items.find((item) => item.id === newItem.id);
  if (existingItem) {
    return NextResponse.json({
      message: "Item with this ID already exists",
      newItem,
    });
  }

  items.push(newItem);

  fs.writeFileSync(filePath, JSON.stringify(items, null, 2), "utf8");

  const response = NextResponse.json({
    message: "Item added successfully",
    newItem,
  });
  response.cookies.set("device-token", deviceToken, {
    httpOnly: true,
    // secure: true, // cookies HTTP addresses with secure=true are not saved
    maxAge: 60 * 60 * 24 * 365, // 1 year expiration
  });

  return response;
}
