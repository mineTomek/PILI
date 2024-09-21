export default function Navbar() {
  return (
    <div className="h-12 fixed top-0 left-0 right-0 z-10 pointer-events-none">
      <div className="flex justify-center relative h-full">
        <h1 className="font-black text-3xl my-auto tracking-wider px-4 z-10">
          PILI
        </h1>

        <div className="absolute inset-0 -bottom-32 fade-out-mask backdrop-blur" />
      </div>
    </div>
  );
}
