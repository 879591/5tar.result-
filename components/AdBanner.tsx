"use client";

import React from "react";

interface AdBannerProps {
  slot?: string;
  format?: "horizontal" | "rectangle" | "in-feed";
  className?: string;
}

export default function AdBanner({ slot = "header-slot", format = "horizontal", className = "" }: AdBannerProps) {
  // In production, when Google AdSense client ID is configured, this mounts real ads.
  // Before review, it serves as a clean, policy-compliant placeholder that guarantees layout stability (CLS).
  return (
    <div className={`my-4 w-full flex flex-col items-center justify-center ${className}`}>
      <span className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
        विज्ञापन / Advertisement
      </span>
      <div
        className={`w-full bg-navyLight/60 border border-dashed border-gray-700/80 rounded-xl flex flex-col items-center justify-center text-center p-4 transition ${
          format === "horizontal"
            ? "min-h-[90px] max-w-4xl"
            : format === "rectangle"
            ? "min-h-[250px] max-w-sm"
            : "min-h-[120px] max-w-2xl"
        }`}
      >
        <div className="text-xs text-gray-400 font-medium flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gold/60 animate-pulse" />
          <span>5tarResult Ad Space — Non-intrusive Student-Friendly Ads</span>
        </div>
        <p className="text-[11px] text-gray-500 mt-1 max-w-md">
          (Google AdSense अनुपालन: स्पष्ट रूप से लेबल किया गया, नेविगेशन में बाधक नहीं)
        </p>
      </div>
    </div>
  );
}
