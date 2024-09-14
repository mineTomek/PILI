"use client";

import Button from "@/app/components/Button";
import ItemModal from "@/app/components/items/ItemModal";
import Loading from "@/app/components/Loading";
import Item from "@/utils/structures/Item";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ItemPage({ params }: { params: { id: string } }) {
  const [item, setItem] = useState<Item>();
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const loadItem = async () => {
      setLoading(true);
      const response = await fetch(`/api/items/get/${params.id}`);
      const loadedItem: Item = (await response.json()).item;
      setItem(loadedItem);
      setLoading(false);
    };

    loadItem();
  }, [params.id]);

  if (loading || !item) {
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
        <ItemModal item={item} />
      </div>
    </>
  );
}
