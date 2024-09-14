import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";
import Storage from "@/utils/structures/Storage";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let newStorage: Storage;

  try {
    newStorage = await request.json();
  } catch (error: any) {
    return NextResponse.json(
      { message: "Invalid JSON body", error: error.message },
      { status: 400 }
    );
  }

  if (!newStorage) {
    return NextResponse.json(
      { message: "Request body cannot be empty" },
      { status: 400 }
    );
  }

  let deviceToken = request.cookies.get("device-token")?.value;

  if (!deviceToken) {
    deviceToken = uuid();
  }

  newStorage.author_id = deviceToken;

  const filePath = path.join("data", "storages.json");
  const data = fs.readFileSync(filePath, "utf8");
  const storages: Storage[] = JSON.parse(data);

  if (!newStorage.id) {
    newStorage.id = uuid();
  }

  const existingStorage = storages.find((storage) => storage.id === newStorage.id);
  if (existingStorage) {
    return NextResponse.json({
      message: "Item with this ID already exists",
      newItem: newStorage,
    });
  }

  storages.push(newStorage);

  fs.writeFileSync(filePath, JSON.stringify(storages, null, 2), "utf8");

  const response = NextResponse.json({
    message: "Item added successfully",
    newItem: newStorage,
  });
  response.cookies.set("device-token", deviceToken, {
    httpOnly: true,
    // secure: true, // cookies HTTP addresses with secure=true are not saved
    maxAge: 60 * 60 * 24 * 365, // 1 year expiration
  });

  return response;
}
