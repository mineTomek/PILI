"use client";

import { useState } from "react";
import ItemList from "./components/items/ItemList";
import Navbar from "./components/Navbar";
import Button from "./components/Button";
import StorageList from "./components/storages/StorageList";
import RoomList from "./components/rooms/RoomList";
import HouseList from "./components/house/HouseList";

export default function Home() {
  const [currentView, setCurrentView] = useState("item");

  return (
    <main>
      <Navbar />
      <div className="flex flex-col gap-6 justify-center items-center mt-12 h-[calc(100dvh-3rem)] px-10">
        <div className="bg-zinc-300 dark:bg-zinc-700 p-3 rounded-[20px] flex gap-3 shadow-md">
          <Button className="bg-white dark:bg-zinc-600 dark:text-zinc-200" onClick={() => setCurrentView("item")}>
            Items
          </Button>
          <Button
            className="bg-white dark:bg-zinc-600 dark:text-zinc-200"
            onClick={() => setCurrentView("storage")}
          >
            Storages
          </Button>
          <Button
            className="bg-white dark:bg-zinc-600 dark:text-zinc-200"
            onClick={() => setCurrentView("room")}
          >
            Rooms
          </Button>
          <Button
            className="bg-white dark:bg-zinc-600 dark:text-zinc-200"
            onClick={() => setCurrentView("house")}
          >
            Houses
          </Button>
        </div>

        {currentView === "item" && <ItemList />}
        {currentView === "storage" && <StorageList />}
        {currentView === "room" && <RoomList />}
        {currentView === "house" && <HouseList />}
      </div>
    </main>
  );
}
