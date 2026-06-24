import React from "react";
import { noiseOverlay, noiseOverlayDark, gradientBannerOrange, gradientBannerGreen, gradientBannerDark, gradientBannerBrown, gradientBannerSky } from "@/lib/portalDesign";

const VARIANTS = {
  orange:  { bg: gradientBannerOrange, text: "#1a1a1a", sub: "rgba(26,26,26,0.45)", noise: noiseOverlay },
  green:   { bg: gradientBannerGreen,  text: "#ffffff", sub: "rgba(255,255,255,0.5)",  noise: noiseOverlayDark },
  dark:    { bg: gradientBannerDark,   text: "#ffffff", sub: "rgba(255,255,255,0.45)", noise: noiseOverlayDark },
  brown:   { bg: gradientBannerBrown,  text: "#ffffff", sub: "rgba(255,255,255,0.5)",  noise: noiseOverlayDark },
  sky:     { bg: gradientBannerSky,   text: "#1a1a1a", sub: "rgba(26,26,26,0.45)", noise: noiseOverlay },
};

export default function PageBanner({ title, subtitle, action, children, variant = "orange" }) {
  const v = VARIANTS[variant] || VARIANTS.orange;
  return (
    <div className="px-6 md:px-10 pt-8">
      <div className="relative rounded-3xl px-6 md:px-8 py-8 overflow-hidden" style={v.bg}>
        <div className="absolute inset-0 rounded-3xl pointer-events-none" style={v.noise} />
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-[-0.03em]" style={{ color: v.text }}>{title}</h1>
            {subtitle && <p className="text-sm mt-1 font-light" style={{ color: v.sub }}>{subtitle}</p>}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
        {children && <div className="relative z-10 mt-4">{children}</div>}
      </div>
    </div>
  );
}