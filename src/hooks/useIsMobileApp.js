import { useState, useEffect } from "react";

/**
 * Returns true when the user is on a mobile/tablet device or using the PWA.
 * Desktop browsers get the webapp layout; mobile browsers and installed PWA get the app layout.
 */
export default function useIsMobileApp() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isPWA = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
      const isMobileUA = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
      const isNarrow = window.innerWidth < 768;
      setIsMobile(isPWA || isMobileUA || isNarrow);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}