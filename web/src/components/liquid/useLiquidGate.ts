"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Plasma draws one full-viewport WebGL canvas per provider, so only one section
 * may run it at a time. Sections ask for the "lock" while they are on screen and
 * hand it back when they leave; a waiting section retries when it is released.
 */
let owner: symbol | null = null;
const waiting = new Set<() => void>();

function acquire(id: symbol): boolean {
  if (owner === null || owner === id) {
    owner = id;
    return true;
  }
  return false;
}

function release(id: symbol) {
  if (owner !== id) return;
  owner = null;
  waiting.forEach((retry) => retry());
}

function supportsWebGL2(): boolean {
  try {
    return Boolean(document.createElement("canvas").getContext("webgl2"));
  } catch {
    return false;
  }
}

/**
 * True while the section should render liquid panels: a desktop with a mouse and
 * WebGL2, the section on screen (below the sticky header), and nobody else
 * holding the canvas.
 */
export function useLiquidGate(ref: RefObject<HTMLElement | null>): boolean {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const id = Symbol("liquid-section");
    const desktop = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const webgl = supportsWebGL2();
    let onScreen = false;

    const apply = () => {
      const wants = webgl && desktop.matches && onScreen;
      if (wants && acquire(id)) {
        setActive(true);
      } else {
        setActive(false);
        release(id);
      }
    };

    // The sticky header covers the top 64px, so a section hidden behind it counts as off screen.
    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        apply();
      },
      { rootMargin: "-64px 0px 0px 0px" },
    );
    observer.observe(section);
    desktop.addEventListener("change", apply);
    waiting.add(apply);
    return () => {
      observer.disconnect();
      desktop.removeEventListener("change", apply);
      waiting.delete(apply);
      release(id);
    };
  }, [ref]);

  return active;
}
