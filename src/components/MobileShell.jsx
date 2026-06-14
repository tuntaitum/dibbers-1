import React from "react";
import useIsMobileApp from "@/hooks/useIsMobileApp";

/**
 * Wraps content in either:
 * - Mobile: the centered phone-width shell (max-w-[430px], drop shadow, zinc bg)
 * - Web: a standard full-width page container
 */
export default function MobileShell({ children, webClassName = "min-h-screen bg-background" }) {
  const isMobile = useIsMobileApp();

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        {children}
      </div>
    );
  }

  return (
    <div className={webClassName}>
      {children}
    </div>
  );
}