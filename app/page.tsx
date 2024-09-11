import ItemList from "./components/items/ItemList";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <main>
      <Navbar />
      <div className="flex flex-col gap-6 justify-center items-center mt-12 h-[calc(100dvh-3rem)] px-10">
        <ItemList />
      </div>
    </main>
  );
}
