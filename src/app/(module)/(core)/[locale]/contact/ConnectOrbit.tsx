"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  initialCount?: number;
  radius?: number;
};

const DEFAULT_LINKS = [
  { href: "https://github.com/", title: "GitHub", icon: githubIcon() },
  { href: "https://twitter.com/", title: "Twitter", icon: twitterIcon() },
  { href: "https://www.linkedin.com/", title: "LinkedIn", icon: linkedinIcon() },
  { href: "mailto:hello@example.com", title: "Email", icon: mailIcon() },
  { href: "https://facebook.com/", title: "Facebook", icon: facebookIcon() },
  { href: "https://instagram.com/", title: "Instagram", icon: instagramIcon() },
];

export default function ConnectOrbit({ initialCount = 6, radius = 140 }: Props) {
  const [active, setActive] = useState(false);
  const [count, setCount] = useState(initialCount);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const thetaRef = useRef(0); // rotation angle in radians
  const progressRef = useRef(0); // 0..1 animation progress for expand

  const links = useMemo(() => DEFAULT_LINKS.slice(0, Math.max(1, Math.min(count, DEFAULT_LINKS.length))), [count]);

  // refs for child elements
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  itemRefs.current = [];
  const setItemRef = (el: HTMLAnchorElement | null) => {
    if (el) itemRefs.current.push(el);
  };

  useEffect(() => {
    const durationExpand = 600; // ms
    const speed = (Math.PI * 2) / 12000; // radians per ms for full 12s rotation

    const step = (time: number) => {
      if (startRef.current === null) startRef.current = time;
      const elapsed = time - startRef.current;

      // update theta
      thetaRef.current = (elapsed * speed) % (Math.PI * 2);

      // update expand progress when toggled
      if (active) {
        progressRef.current = Math.min(1, elapsed / durationExpand);
      } else {
        // when deactivating, reverse progress using elapsed since toggle
        progressRef.current = Math.max(0, 1 - elapsed / durationExpand);
      }

      // position items
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const cx = rect.width / 2;
        const cy = rect.height / 2;

        const n = links.length;
        for (let i = 0; i < n; i++) {
          const el = itemRefs.current[i];
          if (!el) continue;
          const baseAngle = (2 * Math.PI * i) / n;
          const angle = baseAngle + thetaRef.current;
          const eased = easeOutCubic(progressRef.current);
          const r = radius * eased;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          el.style.left = `${x}px`;
          el.style.top = `${y}px`;
          el.style.opacity = `${progressRef.current}`;
          el.style.transform = `translate(-50%,-50%)`; // keep upright
        }
      }

      rafRef.current = requestAnimationFrame(step);
    };

    // Start or restart animation frame loop when active changes
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startRef.current = null;
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
    // include links length so loop updates when count changes
  }, [active, links.length, radius]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {/* <div className="mb-6 text-center">
        <label className="text-sm text-gray-400">Số nút con: {count}</label>
        <input
          aria-label="Số nút"
          type="range"
          min={1}
          max={DEFAULT_LINKS.length}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="ml-3 align-middle"
        />
      </div> */}

      <div ref={containerRef} className="relative w-[360px] h-[360px] bg-transparent">
        {links.map((link, i) => (
          <a
            key={i}
            ref={setItemRef}
            href={link.href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={link.title}
            className="absolute w-12 h-12 rounded-full bg-white/95 text-xs shadow-md flex items-center justify-center"
            style={{ left: `50%`, top: `50%`, opacity: 0, transform: `translate(-50%,-50%)`, transition: `opacity 300ms ease` }}
            dangerouslySetInnerHTML={{ __html: `<span class="w-6 h-6 inline-block">${link.icon}</span>` }}
          />
        ))}

        <button
          className="z-20 absolute left-1/2 top-1/2 w-20 h-20 rounded-full bg-blue-600 text-white font-semibold shadow-lg flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
          onClick={() => {
            setActive((s) => !s);
            // reset start to trigger expand/contract animation
            startRef.current = null;
          }}
        >
          Connect
        </button>
      </div>

      {/* <p className="mt-6 text-sm text-gray-400">Nhấn nút để hiện các liên kết, kéo slider để thay đổi số lượng.</p> */}
    </div>
  );
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function githubIcon() {
  return `
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 .5a12 12 0 00-3.79 23.4c.6.11.82-.26.82-.58v-2.1c-3.34.73-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.1-.75.08-.74.08-.74 1.22.09 1.86 1.25 1.86 1.25 1.08 1.85 2.83 1.32 3.52 1.01.11-.78.42-1.32.76-1.62-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.5 11.5 0 016 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.47 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58A12 12 0 0012 .5z" />
  </svg>`;
}

function twitterIcon() {
  return `
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M23 4.56c-.77.34-1.6.57-2.46.67a4.3 4.3 0 001.88-2.38 8.59 8.59 0 01-2.72 1.04 4.28 4.28 0 00-7.3 3.9A12.14 12.14 0 013 3.1a4.28 4.28 0 001.33 5.71 4.24 4.24 0 01-1.94-.54v.05a4.28 4.28 0 003.43 4.2 4.3 4.3 0 01-1.93.07 4.28 4.28 0 004 2.98A8.6 8.6 0 012 19.54a12.13 12.13 0 006.56 1.92c7.88 0 12.2-6.53 12.2-12.2v-.56A8.7 8.7 0 0023 4.56z"/>
  </svg>`;
}

function linkedinIcon() {
  return `
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.98 3.5a2.5 2.5 0 11-.01 5.01 2.5 2.5 0 01.01-5.01zM3 9h4v12H3zM9 9h3.78v1.64h.05c.53-.99 1.83-2.03 3.77-2.03 4.03 0 4.78 2.66 4.78 6.12V21h-4v-5.02c0-1.2-.02-2.75-1.68-2.75-1.68 0-1.94 1.31-1.94 2.66V21H9z"/>
  </svg>`;
}

function mailIcon() {
  return `
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>`;
}

function facebookIcon() {
  return `
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2.3V12h2.3V9.8c0-2.3 1.36-3.6 3.44-3.6.99 0 2.03.18 2.03.18v2.23h-1.14c-1.12 0-1.47.7-1.47 1.42V12h2.5l-.4 2.9h-2.1v7A10 10 0 0022 12z"/>
  </svg>`;
}

function instagramIcon() {
  return `
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6.5A4.5 4.5 0 1016.5 13 4.5 4.5 0 0012 8.5zm4.75-3.6a1.05 1.05 0 11-1.05-1.05 1.05 1.05 0 011.05 1.05zM12 10.5A1.5 1.5 0 113 12 1.5 1.5 0 0112 10.5z"/>
  </svg>`;
}
