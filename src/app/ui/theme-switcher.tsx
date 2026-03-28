"use client";

import { useTheme } from "next-themes";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

type ThemeSwitcherProps = {
  width?: number;
  height?: number;
  widthAuto?: boolean;
};

const ThemeSwitcher = ({
  width = 64,
  height = 34,
}: ThemeSwitcherProps) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const padding = Math.max(2, Math.round(height * 0.12));
  const thumbSize = Math.max(12, height - padding * 2);
  const thumbOffset = width - (thumbSize + padding * 2);
  const iconSize = Math.max(10, Math.round(thumbSize * 0.54));
  const isDark = mounted && (theme === "dark" || (theme === "system" && resolvedTheme === "dark"));

  useEffect(() => {
    (() => { setMounted(true) })();
  }, []);

  const toggle = () => {
    if (!mounted) return;
    const active = theme === "system" ? resolvedTheme : theme;
    setTheme(active === "dark" ? "light" : "dark");
  };

  return (
    <div
      role="button"
      aria-label="Toggle theme"
      onClick={toggle}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggle(); }}
      tabIndex={0}
      style={{
        width: width,
        height,
        borderRadius: 999,
        padding,
        display: "flex",
        alignItems: "center",
        background: isDark ? "linear-gradient(90deg,#334155,#0f172a)" : "linear-gradient(90deg,#fed7aa,#fff7ed)",
        cursor: "pointer",
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)"
      }}
      ref={containerRef}
    >
      <div style={{
        width: thumbSize,
        height: thumbSize,
        borderRadius: 999,
        background: isDark ? "#0f172a" : "#f59e0b",
        transform: isDark ? `translateX(${thumbOffset}px)` : "translateX(0)",
        transition: "transform 200ms ease, background 200ms ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff"
      }}>
        {isDark ? (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor" />
          </svg>
        ) : (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 7a5 5 0 100 10 5 5 0 000-10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
