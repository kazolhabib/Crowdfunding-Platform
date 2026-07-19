"use client";

import React from "react";

export default function LoadingSpinner({ label = "Fetching data...", className = "", textClassName = "text-[#645d52]" }) {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[40vh] gap-6 ${className}`}>
      <div className="w-12 h-12 border-4 border-[#bfb5a3] border-t-[#9a3412] animate-spin rounded-none shadow-[4px_4px_0_#24231f]" />
      <p className={`text-xs font-bold uppercase tracking-[0.2em] animate-pulse ${textClassName}`}>
        {label}
      </p>
    </div>
  );
}
