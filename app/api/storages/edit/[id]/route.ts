import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Storage from "@/utils/structures/Storage";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const storageId = params.id;
  const updatedData: Partial<Storage> = await request.json();

  const filePath = path.join("data", "storages.json");
  const data = fs.readFileSync(filePath, "utf8");
  const storages: Storage[] = JSON.parse(data);

  const storageIndex = storages.findIndex((storage) => storage.id === storageId);

  if (storageIndex === -1) {
    return NextResponse.json(
      { message: `Storage with id ${storageId} not found` },
      { status: 404 }
    );
  }

  const updatedStorage = { ...storages[storageIndex], ...updatedData };

  storages[storageIndex] = updatedStorage;

  fs.writeFileSync(filePath, JSON.stringify(storages, null, 2), "utf8");

  return NextResponse.json({
    message: "Storage updated successfully",
    updatedItem: updatedStorage,
  });
}
