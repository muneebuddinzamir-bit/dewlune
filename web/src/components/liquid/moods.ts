import type { Mood } from "@cruxgarden/plasma-ui";

/** Dewlune's evening palette for the hero: night plum into a warm dusk glow. */
export const duskMood: Mood = {
  colors: ["#1b1530", "#3b2a6b", "#e9a58f"],
  blend: 22,
  spring: { stiffness: 160, damping: 15 },
};

/** The footer's palette: a deeper midnight with moonlight gold. */
export const midnightMood: Mood = {
  colors: ["#0f0c1d", "#2a1f4f", "#e6c98d"],
  blend: 22,
  spring: { stiffness: 160, damping: 15 },
};
