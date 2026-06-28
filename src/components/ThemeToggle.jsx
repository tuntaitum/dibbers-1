import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className={`no-frost flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl text-[#1a1a1a]/55 hover:text-[#1a1a1a] dark:text-white/60 dark:hover:text-white transition-colors ${className}`}
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}