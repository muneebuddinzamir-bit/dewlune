"use client";

import { Plasma, PlasmaProvider, usePlasmaRuntime, type Mood } from "@cruxgarden/plasma-ui";
import { useCallback, useEffect, type ReactNode, type RefObject } from "react";
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
  const LiquidSurface = useCallback(
    ({ className, children, radius = 28, draggable, fuse = true, label }: SurfaceProps) => (
      <Plasma
        className={`liquid-panel ${className ?? ""}`}
        radius={radius}
        draggable={draggable}
        fuse={fuse}
        lean={draggable ? 8 : false}
        bounds={bounds}
        group="hero"
        aria-label={label}
        role={label ? "group" : undefined}
      >
        {children}
      </Plasma>
    ),
    [bounds],
  );

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
