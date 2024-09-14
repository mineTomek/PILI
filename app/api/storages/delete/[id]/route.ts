import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import Storage from "@/utils/structures/Storage";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const filePath = path.join("data", "storages.json");
  const data = fs.readFileSync(filePath, "utf8");
  let storages: Storage[] = JSON.parse(data);

  const storageIndex = storages.findIndex((storage) => storage.id === params.id);

  if (storageIndex > -1) {
    const removedStorage = storages.splice(storageIndex, 1);
    fs.writeFileSync(filePath, JSON.stringify(storages, null, 2), "utf8");
    return NextResponse.json({
      message: "Storage removed successfully",
      item: removedStorage,
    });
  } else {
    return NextResponse.json({ message: "Storage not found" }, { status: 404 });
  }
}
