/** fanus işareti: tabanın üstünde cam fanus, içinde alev. */
export function FanusIsareti({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path d="M8.5 27V14.5a7.5 7.5 0 0 1 15 0V27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="5" r="1.4" fill="currentColor" />
      <path d="M5 27.5h22" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M16 13.2c2.3 2.7 3.4 4.7 3.4 6.6a3.4 3.4 0 0 1-6.8 0c0-1.9 1.1-3.9 3.4-6.6Z" className="fill-alev" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <FanusIsareti className="size-7 text-krem" />
      <span className="font-baslik text-[1.375rem] leading-none font-semibold tracking-[-0.03em]">
        fanus<span className="text-soluk">.tr</span>
      </span>
    </span>
  );
}
