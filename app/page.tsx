"use client";

import { useState } from "react";
import ItemList from "./components/items/ItemList";
import Navbar from "./components/Navbar";
import Button from "./components/Button";
import StorageList from "./components/storages/StorageList";
import RoomList from "./components/rooms/RoomList";
import HouseList from "./components/house/HouseList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightRotate,
  faSearch,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { mergeCss } from "@/utils/mergeCss";
import SearchBar from "./components/SearchBar";

export default function Home() {
  const [currentView, setCurrentView] = useState("item");
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshLists = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <main>
      <Navbar />
      <div className="flex flex-col gap-6 justify-center items-center mt-12 .min-h-dvh px-10 py-32">
        <div className="flex gap-3">
          <Button className={mergeCss("bg-[transparent!important]")} onClick={refreshLists}>
            <FontAwesomeIcon icon={faArrowRightRotate} />
          </Button>

          <div className="bg-zinc-300 dark:bg-zinc-700 p-3 rounded-[20px] flex gap-3 shadow-md">
            <div className="relative">
              <div
                className={mergeCss(
                  "flex gap-3 transition-opacity",
                  searchActive && "opacity-0"
                )}
              >
                <Button
                  className="bg-white dark:bg-zinc-600 dark:text-zinc-200"
                  onClick={() => setCurrentView("item")}
                >
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

              <SearchBar
                className={mergeCss(
                  "absolute inset-0 bg-transparent transition-opacity px-3 rounded-lg",
                  !searchActive && "opacity-0 pointer-events-none"
                )}
                onSearch={setSearchQuery}
              />
            </div>

            <Button
              onClick={() => {
                !searchActive && setSearchActive(true);
                setCurrentView("item");
              }}
            >
              <FontAwesomeIcon icon={faSearch} />
            </Button>
          </div>

          <Button
            className={mergeCss(
              "transition-opacity bg-[transparent!important]",
              !searchActive && "opacity-0"
            )}
            onClick={() => searchActive && setSearchActive(false)}
          >
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        </div>

        {currentView === "item" && <ItemList refreshKey={refreshKey} searchQuery={searchQuery} />}
        {currentView === "storage" && <StorageList refreshKey={refreshKey} />}
        {currentView === "room" && <RoomList refreshKey={refreshKey} />}
        {currentView === "house" && <HouseList refreshKey={refreshKey} />}
      </div>
    </main>
  );
}
