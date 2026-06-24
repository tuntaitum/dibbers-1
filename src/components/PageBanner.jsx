import React from "react";
import { noiseOverlay, gradientBanner } from "@/lib/portalDesign";

export default function PageBanner({ title, subtitle, action, children }) {
  return (
    <div className="px-6 md:px-10 pt-8">
      <div className="relative rounded-3xl px-6 md:px-8 py-8 overflow-hidden" style={gradientBanner}>
        <div className="absolute inset-0 rounded-3xl pointer-events-none" style={noiseOverlay} />
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-[-0.03em] text-[#1a1a1a]">{title}</h1>
            {subtitle && <p className="text-[#1a1a1a]/40 text-sm mt-1 font-light">{subtitle}</p>}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
        {children && <div className="relative z-10 mt-4">{children}</div>}
      </div>
    </div>
  );
}