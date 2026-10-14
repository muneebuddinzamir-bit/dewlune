"use client";

import { Plasma, PlasmaProvider, usePlasmaRuntime, type Mood, type Offset } from "@cruxgarden/plasma-ui";
import { useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { GlassSurface, type Surface, type SurfaceProps } from "./surface";

/** Dewlune's evening palette for the liquid field: night plum into a warm dusk glow. */
const dusk: Mood = {
  colors: ["#1b1530", "#3b2a6b", "#e9a58f"],
  blend: 22,
  spring: { stiffness: 160, damping: 15 },
};

type Props = {
  bounds: RefObject<HTMLElement | null>;
  render: (surface: Surface) => ReactNode;
  /** Called once the renderer is mounted, so the hero can drop its CSS backdrop without a flash. */
  onReady: () => void;
};

/**
 * Loaded only on desktop: mounts the Plasma renderer and hands the hero a
 * liquid version of its panels. The renderer draws a full-viewport canvas
 * behind the page, so the hero unmounts this as soon as it scrolls away.
 */
export default function LiquidStage({ bounds, render, onReady }: Props) {
  const LiquidSurface = useCallback((props: SurfaceProps) => <LiquidPanel bounds={bounds} {...props} />, [bounds]);

  return (
    <PlasmaProvider
      mood={dusk}
      theme="dark"
      tint="#ffffff"
      opacity={0.05}
      frost={0.3}
      elevation={0.45}
      viscosity={0.55}
      grain={0.5}
      maxSurfaces={8}
    >
      <WhenRendererReady liquid={LiquidSurface} render={render} onReady={onReady} />
    </PlasmaProvider>
  );
}

/**
 * The provider creates its WebGL renderer in an effect, after its children mount.
 * Until then (or for good, if WebGL fails) the panels stay frosted CSS, so there is
 * no blank frame and no surface registers before the renderer exists.
 */
function WhenRendererReady({ liquid, render, onReady }: { liquid: Surface; render: Props["render"]; onReady: () => void }) {
  const { renderer } = usePlasmaRuntime();
  useEffect(() => {
    if (renderer) onReady();
  }, [renderer, onReady]);
  return <>{render(renderer ? liquid : GlassSurface)}</>;
}

function translateOf(el: HTMLElement): Offset {
  const m = /translate3d\(([-\d.]+)px,\s*([-\d.]+)px/.exec(el.style.transform);
  return m ? { x: Number(m[1]), y: Number(m[2]) } : { x: 0, y: 0 };
}

/**
 * Where a dropped panel would land on top of another, push it out to the nearest
 * edge. The two still touch, so they stay fused, but their text never stacks.
 */
function resolveOverlap(el: HTMLElement, offset: Offset, area?: DOMRect): Offset | null {
  const now = el.getBoundingClientRect();
  const moved = translateOf(el);
  const others = [...document.querySelectorAll<HTMLElement>(".liquid-panel")].filter((o) => o !== el).map((o) => o.getBoundingClientRect());
  let { x, y } = offset;
  let changed = false;
  for (let pass = 0; pass < 4; pass++) {
    const left = now.left - moved.x + x;
    const top = now.top - moved.y + y;
    const right = left + now.width;
    const bottom = top + now.height;
    const hit = others.find((b) => left < b.right && right > b.left && top < b.bottom && bottom > b.top);
    if (!hit) break;
    const pushes = [
      { dx: hit.left - right, dy: 0 },
      { dx: hit.right - left, dy: 0 },
      { dx: 0, dy: hit.top - bottom },
      { dx: 0, dy: hit.bottom - top },
    ];
    // Prefer the shortest push that keeps the panel inside the hero.
    const inside = area
      ? pushes.filter(
          (p) => left + p.dx >= area.left && right + p.dx <= area.right && top + p.dy >= area.top && bottom + p.dy <= area.bottom,
        )
      : [];
    const best = (inside.length ? inside : pushes).reduce((a, b) => (Math.abs(a.dx + a.dy) <= Math.abs(b.dx + b.dy) ? a : b));
    x += best.dx;
    y += best.dy;
    changed = true;
  }
  return changed ? { x, y } : null;
}

function LiquidPanel({
  bounds,
  className,
  children,
  radius = 28,
  draggable,
  fuse = true,
  label,
}: SurfaceProps & { bounds: RefObject<HTMLElement | null> }) {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState<Offset>();

  const onDragEnd = (settled: Offset) => {
    const el = ref.current;
    const fixed = el && resolveOverlap(el, settled, bounds.current?.getBoundingClientRect());
    if (!fixed) return;
    // Plasma only springs when the offset prop changes, so nudge a repeat of the same fix.
    setOffset((prev) => (prev && prev.x === fixed.x && prev.y === fixed.y ? { x: fixed.x + 0.01, y: fixed.y } : fixed));
  };

  return (
    <Plasma
      ref={ref}
      className={`liquid-panel ${className ?? ""}`}
      radius={radius}
      draggable={draggable}
      fuse={fuse}
      lean={draggable ? 8 : false}
      bounds={bounds}
      group="hero"
      offset={offset}
      onDragEnd={draggable ? onDragEnd : undefined}
      aria-label={label}
      role={label ? "group" : undefined}
    >
      {children}
    </Plasma>
  );
}
