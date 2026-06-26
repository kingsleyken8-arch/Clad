/** Small shared bits for the Wanderful content sections. */

export function Tag({ n, label }: { n: string; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-2 py-1 pr-4">
      <span className="grid h-6 w-6 place-items-center rounded-full bg-black text-[10px] font-medium text-white">
        {n}
      </span>
      <span className="text-[12px] font-medium text-[#3a3a3a]">{label}</span>
    </div>
  );
}

export function Avatar({ initials }: { initials: string }) {
  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#f3a981] to-[#e8743b] text-[12px] font-semibold text-white">
      {initials}
    </span>
  );
}
