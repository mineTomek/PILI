"use client";

import Button from "@/app/components/Button";
import StorageModal from "@/app/components/storages/StorageModal";
import Loading from "@/app/components/Loading";
import Storage from "@/utils/structures/Storage";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ItemPage({ params }: { params: { id: string } }) {
  const [storage, setStorage] = useState<Storage>();
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const loadStorage = async () => {
      setLoading(true);
      const response = await fetch(`/api/storage/get/${params.id}`);
      const loadedStorage: Storage = (await response.json()).item;
      setStorage(loadedStorage);
      setLoading(false);
    };

    loadStorage();
  }, [params.id]);

  if (loading || !storage) {
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
        <StorageModal item={storage} />
      </div>
    </>
  );
}
