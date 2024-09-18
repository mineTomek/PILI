"use client";

import Button from "@/app/components/Button";
import HouseModal from "@/app/components/house/HouseModal";
import House from "@/utils/structures/House";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function HousePage({ params }: { params: { id: string } }) {
  const [house, setHouse] = useState<House>();
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const loadHouse = async () => {
      setLoading(true);
      
      const houseResponse = await fetch(`/api/house/get/${params.id}`);
      const loadedHouse: House = (await houseResponse.json()).item;
      setHouse(loadedHouse);

      setLoading(false);
    };

    loadHouse();
  }, [params.id]);

  if (loading || !house) {
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
        <HouseModal item={house} />
      </div>
    </>
  );
}
