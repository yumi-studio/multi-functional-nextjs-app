"use client";

import React, { useEffect, useRef, useState } from "react";

type Star = {
  id: number;
  left: string;
  top: string;
  size: string;
  duration: number;
  delay: number;
  opacity: number;
};

type TrailPoint = { x: number; y: number };

const NUM_STARS = 100;

export default function StarryBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const [stars] = useState<Star[]>(() =>
    Array.from({ length: NUM_STARS }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 0.6}px`,
      duration: +(Math.random() * 3 + 1.2).toFixed(2),
      delay: +(Math.random() * 4).toFixed(2),
      opacity: +(Math.random() * 0.6 + 0.3).toFixed(2),
    }))
  );

  const cometPos = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const target = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const trailRef = useRef<TrailPoint[]>([]);
  const [comet, setComet] = useState<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const [trail, setTrail] = useState<TrailPoint[]>([]);

  useEffect(() => {
    if (!document.getElementById("starry-keyframes")) {
      const style = document.createElement("style");
      style.id = "starry-keyframes";
      style.innerHTML = `@keyframes twinkle { 0%{opacity:0.15}50%{opacity:1}100%{opacity:0.15} }`;
      document.head.appendChild(style);
    }

    const onMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      target.current.x = e.clientX - rect.left;
      target.current.y = e.clientY - rect.top;
    };

    window.addEventListener("mousemove", onMove);

    let lastPush = 0;

    const tick = () => {
      // move comet toward target
      cometPos.current.x += (target.current.x - cometPos.current.x) * 0.18;
      cometPos.current.y += (target.current.y - cometPos.current.y) * 0.18;

      const now = performance.now();
      // push trail point at ~30ms intervals when comet is visible
      if (now - lastPush > 30) {
        lastPush = now;
        trailRef.current.unshift({ x: cometPos.current.x, y: cometPos.current.y });
        if (trailRef.current.length > 18) trailRef.current.length = 18;
        // update React state periodically (throttled) so render reads state not refs
        setComet({ x: cometPos.current.x, y: cometPos.current.y });
        setTrail(trailRef.current.slice());
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="absolute top-0 left-0 w-full h-full -z-1 overflow-hidden pointer-events-none"
      style={{
        background: 'radial-gradient(ellipse at 20% 80%, rgba(40,60,90,0.25) 0%, rgba(0,6,20,0.9) 45%, #000 100%)',
      }}
    >
      {stars.map((s) => (
        <span
          key={s.id}
          style={{
            position: "absolute",
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "#fff",
            opacity: s.opacity,
            transform: "translate(-50%,-50%)",
            boxShadow: "0 0 6px rgba(255,255,255,0.9)",
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}

      {/* comet trail */}
      {trail.map((p, i) => {
        const alpha = (1 - i / trail.length) ** 2;
        const size = 18 * (1 - i / trail.length) + 2;
        return (
          <span
            key={`trail-${i}`}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: "50%",
              transform: "translate(-50%,-50%)",
              background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,${0.9 * alpha}) 0%, rgba(255,200,120,${0.25 * alpha}) 30%, rgba(255,120,60,${0.05 * alpha}) 60%, transparent 100%)`,
              filter: "blur(6px)",
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* comet head */}
      <span
        style={{
          position: "absolute",
          left: comet.x,
          top: comet.y,
          width: 8,
          height: 8,
          borderRadius: "50%",
          transform: "translate(-50%,-50%)",
          background: "radial-gradient(circle, #fff 0%, #ffd7a6 50%, rgba(255,200,120,0.0) 100%)",
          boxShadow: "0 0 8px rgba(255,220,160,0.9)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
