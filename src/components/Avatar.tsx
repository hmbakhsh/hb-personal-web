export default function Avatar() {
  return (
    <div className="group relative h-[68px] w-[68px] select-none">
      <img
        src="/haroon.jpg"
        alt="Haroon Bakhsh"
        className="absolute inset-0 h-full w-full rounded-[15px] object-cover transition-opacity duration-300 ease-out [@media(hover:hover)]:group-hover:opacity-0"
      />
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center rounded-[15px] bg-gradient-to-b from-[#8d919b] to-[#6a6e75] opacity-0 transition-opacity duration-300 ease-out [@media(hover:hover)]:group-hover:opacity-100"
      >
        <span className="text-[27px] font-semibold leading-none tracking-[-0.02em] text-white">
          HB
        </span>
      </div>
    </div>
  );
}
