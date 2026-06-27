import { useRef } from "react";
import { ShieldHalf } from "lucide-react";
import { useReveal } from "../../lib/anim";

export default function TrustBar() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, { stagger: 0.06 });

  return (
    <section ref={ref} className="px-5 py-16 sm:px-8">
      <p data-reveal className="text-center text-[12px] text-white/40">
        Simplifying Blockchain Workflows For{" "}
        <span className="text-white/70">2,500+ Organizations</span>
      </p>
      <div className="mx-auto mt-7 flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} data-reveal className="flex items-center gap-2 text-white/35">
            <ShieldHalf className="h-5 w-5" strokeWidth={1.5} />
            <span className="font-poppins text-[15px] font-semibold tracking-tight">
              Logoipsum
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
