"use client";

import Button from "@/app/components/Button";
import StorageModal from "@/app/components/storages/StorageModal";
import Storage from "@/utils/structures/Storage";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Room from "@/utils/structures/Room";

export default function StoragePage({ params }: { params: { id: string } }) {
  const [storage, setStorage] = useState<Storage>();
  const [roomList, setRoomList] = useState<Room[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const loadStorage = async () => {
      setLoading(true);

      const response = await fetch(`/api/storage/get/${params.id}`);
      const loadedStorage: Storage = (await response.json()).item;
      setStorage(loadedStorage);

      const roomListResponse = await fetch(`/api/room/get/`);
      const loadedRoomList: Room[] = (await roomListResponse.json()).items;
      setRoomList(loadedRoomList);

      setLoading(false);
    };

    loadStorage();
  }, [params.id]);

  if (loading || !storage || !roomList) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Button
        className="size-8 flex justify-center items-center absolute top-8 left-8"
        onClick={() => router.push("/")}
      >
        <FontAwesomeIcon icon={faXmark} />
      </Button>
      <div className="flex items-center min-h-[100dvh] justify-center px-[15%]">
        <StorageModal item={storage} roomList={roomList} />
      </div>
    </>
  );
}
