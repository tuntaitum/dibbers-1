/* Shared portal design tokens — matches landing page aesthetic */

export const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export const noiseOverlay = {
  backgroundImage: NOISE_SVG,
  backgroundSize: "180px 180px",
  mixBlendMode: "overlay",
  opacity: 0.35,
};

export const noiseOverlayDark = {
  backgroundImage: NOISE_SVG,
  backgroundSize: "180px 180px",
  mixBlendMode: "overlay",
  opacity: 0.5,
};

export const frostedCard = {
  background: "rgba(255,255,255,0.55)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.85)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9)",
};

export const gradientBanner = {
  background: "radial-gradient(ellipse at -5% 108%, #EA672D 0%, #EA672Dcc 18%, transparent 52%), radial-gradient(ellipse at 108% -5%, #00452A 0%, #00452Acc 18%, transparent 50%), #F2EFE8",
  borderRadius: "1.5rem",
  boxShadow: "0 24px 64px -16px rgba(0,0,0,0.15), 0 8px 24px -8px rgba(0,0,0,0.08)",
};

export const gradientBannerDark = {
  background: "radial-gradient(ellipse at 0% 105%, #EA672D 0%, #c04e20 20%, transparent 50%), radial-gradient(ellipse at 100% -5%, #002a1a 0%, transparent 55%), #00452A",
  borderRadius: "1.5rem",
  boxShadow: "0 24px 64px -16px rgba(0,69,42,0.4), 0 8px 24px -8px rgba(0,0,0,0.2)",
};

export const frostedCardHover = {
  background: "rgba(255,255,255,0.7)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.95)",
  boxShadow: "0 12px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)",
};

export const adminSidebarBg = {
  background: "radial-gradient(ellipse at 0% 100%, rgba(234,103,45,0.18) 0%, transparent 50%), radial-gradient(ellipse at 100% 0%, #3a231a 0%, transparent 60%), #5D372A",
};

export const venueSidebarBg = {
  background: "radial-gradient(ellipse at 0% 100%, rgba(234,103,45,0.18) 0%, transparent 50%), radial-gradient(ellipse at 100% 0%, #002a1a 0%, transparent 60%), #00452A",
};

export const linenBg = "#F7F5F0";