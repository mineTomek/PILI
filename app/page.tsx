"use client";

import { useState } from "react";
import ItemList from "./components/items/ItemList";
import Navbar from "./components/Navbar";
import Button from "./components/Button";
import StorageList from "./components/storages/StorageList";

export default function Home() {
  const [currentView, setCurrentView] = useState("item");

  return (
    <main>
      <Navbar />
      <div className="flex flex-col gap-6 justify-center items-center mt-12 h-[calc(100dvh-3rem)] px-10">
        <div className="bg-slate-300 p-3 rounded-[20px] flex gap-3 shadow-md">
          <Button className="bg-white" onClick={() => setCurrentView("item")}>
            Items
          </Button>
          <Button
            className="bg-white"
            onClick={() => setCurrentView("storage")}
          >
            Storages
          </Button>
          <Button
            className="bg-white"
            onClick={() => setCurrentView("room")}
            disabled
          >
            Rooms
          </Button>
          <Button
            className="bg-white"
            onClick={() => setCurrentView("house")}
            disabled
          >
            Houses
          </Button>
        </div>

        {currentView === "item" && <ItemList />}
        {currentView === "storage" && <StorageList />}
      </div>
    </main>
  );
}
