"use client";

import Button from "@/app/components/Button";
import Loading from "@/app/components/Loading";
import RoomModal from "@/app/components/rooms/RoomModal";
import House from "@/utils/structures/House";
import Room from "@/utils/structures/Room";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function RoomPage({ params }: { params: { id: string } }) {
  const [room, setRoom] = useState<Room>();
  const [houseList, setHouseList] = useState<House[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const loadRoom = async () => {
      setLoading(true);
      
      const roomResponse = await fetch(`/api/room/get/${params.id}`);
      const loadedRoom: Room = (await roomResponse.json()).item;
      setRoom(loadedRoom);

      const houseListResponse = await fetch(`/api/house/get/`);
      const loadedHouseList: House[] = (await houseListResponse.json()).items;
      setHouseList(loadedHouseList);

      setLoading(false);
    };

    loadRoom();
  }, [params.id]);

  if (loading || !room || !houseList) {
    return <Loading />;
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
        <RoomModal item={room} houseList={houseList} />
      </div>
    </>
  );
}
