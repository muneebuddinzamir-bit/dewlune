import type { ComponentType, ReactNode } from "react";

/** What the hero needs from a panel, whether it is liquid (Plasma) or frosted CSS. */
export type SurfaceProps = {
  className?: string;
  children: ReactNode;
  radius?: number;
  draggable?: boolean;
  /** Fixed panels (the headline) should not melt into the draggable ones. */
  fuse?: boolean;
  label?: string;
};

export type Surface = ComponentType<SurfaceProps>;

/** The frosted CSS panel used on phones, during the server render, and without WebGL2. */
export function GlassSurface({ className, children, radius = 28, label }: SurfaceProps) {
  return (
    <div className={`glass ${className ?? ""}`} style={{ borderRadius: radius }} aria-label={label} role={label ? "group" : undefined}>
      {children}
    </div>
  );
}
