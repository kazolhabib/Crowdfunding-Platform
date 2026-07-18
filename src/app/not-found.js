import React from "react";
import Link from "next/link";
import { Compass, Home, AlertOctagon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-[#f4f0e8] text-[#24231f] flex flex-col items-center justify-center px-5 py-16">
      {/* Decorative dashed boundary line */}
      <div className="w-full max-w-xl mb-8 flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 border-t border-dashed border-[#cfc6b7]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#9a3412]" />
        <span className="h-px flex-1 border-t border-dashed border-[#cfc6b7]" />
      </div>

      {/* Main Brutalist Card */}
      <div className="w-full max-w-xl border border-[#bfb5a3] bg-[#fdfaf4] p-8 md:p-12 shadow-[8px_8px_0_#24231f] rounded-none text-center relative overflow-hidden">
        {/* Subtle background lines/watermark */}
        <div className="absolute top-0 right-0 p-4 opacity-5 text-right font-mono text-[10px] leading-none select-none">
          ERR_CODE_404<br />
          REGISTRY_MISSING<br />
          LAT_LON_UNKNOWN
        </div>

        {/* Accent warning strip */}
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center border border-[#bfb5a3] bg-[#ebe3d5] text-[#9a3412] shadow-[3px_3px_0_#24231f]">
          <AlertOctagon size={28} />
        </div>

        {/* Large 404 Status */}
        <h1 className="font-serif text-[clamp(4.5rem,10vw,7.5rem)] leading-none tracking-[-0.08em] text-[#9a3412]">
          404
        </h1>

        {/* Ticket category labels */}
        <div className="mt-2 mb-6 flex items-center justify-center gap-2">
          <span className="bg-[#24231f] text-[#f4f0e8] px-3 py-1 text-[9px] font-black uppercase tracking-[0.18em]">
            Route Error
          </span>
          <span className="border border-[#bfb5a3] bg-[#ebe3d5] text-[#645d52] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.14em]">
            Not Found
          </span>
        </div>

        {/* Message */}
        <h2 className="font-serif text-2xl tracking-[-0.04em] text-[#24231f] mb-4">
          Lost in the Crowd
        </h2>
        <p className="text-xs text-[#645d52] leading-6 max-w-md mx-auto mb-10">
          The campaign directory path, creator profile, or backer registry page you requested is not active or has moved. Let&apos;s redirect you back to known coordinates.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/campaigns"
            className="w-full sm:w-auto h-12 bg-[#24231f] text-[#f4f0e8] font-bold uppercase tracking-wider text-xs px-6 rounded-none flex items-center justify-center gap-2.5 hover:bg-[#9a3412] border border-[#24231f] hover:border-[#9a3412] shadow-[3px_3px_0_rgba(36,35,31,0.15)] hover:shadow-[3px_3px_0_#24231f] transition-all"
          >
            <Compass size={15} />
            Explore Campaigns
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto h-12 bg-[#ebe3d5] text-[#24231f] font-bold uppercase tracking-wider text-xs px-6 rounded-none flex items-center justify-center gap-2.5 hover:bg-[#24231f] hover:text-[#f4f0e8] hover:border-[#24231f] border border-[#bfb5a3] shadow-[3px_3px_0_#24231f] hover:shadow-[3px_3px_0_#9a3412] transition-all"
          >
            <Home size={15} />
            Return Home
          </Link>
        </div>
      </div>

      {/* Another matching bottom tear line */}
      <div className="w-full max-w-xl mt-8 flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 border-t border-dashed border-[#cfc6b7]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#9a3412]" />
        <span className="h-px flex-1 border-t border-dashed border-[#cfc6b7]" />
      </div>
    </div>
  );
}
