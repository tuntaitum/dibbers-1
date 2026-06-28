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
  background: "var(--frost-bg)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "var(--frost-border)",
  boxShadow: "var(--frost-shadow)",
};

export const gradientBannerOrange = {
  background: "radial-gradient(ellipse at -5% 108%, #EA672D 0%, #EA672Dcc 18%, transparent 52%), radial-gradient(ellipse at 108% -5%, #00452A 0%, #00452Acc 18%, transparent 50%), var(--banner-base)",
  borderRadius: "1.5rem",
  boxShadow: "0 24px 64px -16px rgba(234,103,45,0.18), 0 8px 24px -8px rgba(0,0,0,0.08)",
};

export const gradientBannerGreen = {
  background: "radial-gradient(ellipse at 0% 105%, #EA672D44 0%, transparent 50%), radial-gradient(ellipse at 100% 0%, #002a1a 0%, transparent 60%), #00452A",
  borderRadius: "1.5rem",
  boxShadow: "0 24px 64px -16px rgba(0,69,42,0.35), 0 8px 24px -8px rgba(0,0,0,0.15)",
};

export const gradientBannerDark = {
  background: "radial-gradient(ellipse at 100% 100%, #EA672D 0%, #d4581f 25%, transparent 60%), radial-gradient(ellipse at 0% 0%, #1a1a1a 0%, transparent 50%), #111",
  borderRadius: "1.5rem",
  boxShadow: "0 24px 64px -16px rgba(0,0,0,0.3), 0 8px 24px -8px rgba(0,0,0,0.15)",
};

export const gradientBannerBrown = {
  background: "radial-gradient(ellipse at 0% 100%, #EA672D 0%, transparent 50%), radial-gradient(ellipse at 100% 0%, #3a231a 0%, transparent 60%), #5D372A",
  borderRadius: "1.5rem",
  boxShadow: "0 24px 64px -16px rgba(93,55,42,0.35), 0 8px 24px -8px rgba(0,0,0,0.12)",
};

export const gradientBannerSky = {
  background: "radial-gradient(ellipse at -5% 108%, #D2E8FF 0%, #B0D4F5cc 20%, transparent 55%), radial-gradient(ellipse at 108% -5%, #5D372A22 0%, transparent 50%), var(--banner-base)",
  borderRadius: "1.5rem",
  boxShadow: "0 24px 64px -16px rgba(100,150,200,0.15), 0 8px 24px -8px rgba(0,0,0,0.06)",
};

export const gradientBanner = gradientBannerOrange;

/* ── Frosted gradient banners — semi-transparent, blurred, noise-textured ── */

export const frostedGradientBrown = {
  background: "radial-gradient(ellipse at 0% 100%, rgba(234,103,45,0.7) 0%, transparent 55%), radial-gradient(ellipse at 100% 0%, rgba(58,35,26,0.85) 0%, transparent 60%), rgba(93,55,42,0.75)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow: "0 24px 64px -16px rgba(93,55,42,0.35), 0 8px 24px -8px rgba(0,0,0,0.12)",
  borderRadius: "1.5rem",
};

export const frostedGradientGreen = {
  background: "radial-gradient(ellipse at 0% 100%, rgba(234,103,45,0.35) 0%, transparent 50%), radial-gradient(ellipse at 100% 0%, rgba(0,42,26,0.85) 0%, transparent 60%), rgba(0,69,42,0.75)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow: "0 24px 64px -16px rgba(0,69,42,0.3), 0 8px 24px -8px rgba(0,0,0,0.12)",
  borderRadius: "1.5rem",
};

export const frostedGradientOrange = {
  background: "radial-gradient(ellipse at 100% 100%, rgba(234,103,45,0.75) 0%, transparent 60%), radial-gradient(ellipse at 0% 0%, rgba(26,26,26,0.45) 0%, transparent 50%), rgba(234,103,45,0.6)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.15)",
  boxShadow: "0 24px 64px -16px rgba(234,103,45,0.3), 0 8px 24px -8px rgba(0,0,0,0.12)",
  borderRadius: "1.5rem",
};

/* ── Bolder Explore gradient — vivid multi-color splashes ── */

export const gradientBannerExploreBold = {
  background: "radial-gradient(ellipse at -8% 110%, #EA672D 0%, #EA672Dee 14%, transparent 48%), radial-gradient(ellipse at 110% -10%, #00452A 0%, #00452Acc 14%, transparent 46%), radial-gradient(ellipse at 50% 50%, #D2E8FFdd 0%, #D2E8FF88 20%, transparent 42%), var(--banner-base)",
  borderRadius: "1.5rem",
  boxShadow: "0 24px 64px -16px rgba(234,103,45,0.18), 0 8px 24px -8px rgba(0,0,0,0.08)",
};

export const frostedCardHover = {
  background: "var(--frost-hover-bg)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "var(--frost-hover-border)",
  boxShadow: "var(--frost-hover-shadow)",
};

export const adminSidebarBg = {
  background: "radial-gradient(ellipse at 0% 100%, rgba(234,103,45,0.18) 0%, transparent 50%), radial-gradient(ellipse at 100% 0%, #3a231a 0%, transparent 60%), #5D372A",
};

export const venueSidebarBg = {
  background: "radial-gradient(ellipse at 0% 100%, rgba(234,103,45,0.18) 0%, transparent 50%), radial-gradient(ellipse at 100% 0%, #002a1a 0%, transparent 60%), #00452A",
};

export const linenBg = "var(--page-bg)";