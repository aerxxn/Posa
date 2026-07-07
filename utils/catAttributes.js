//fileUtils.js
export const EYE_COLOR_OPTIONS = [
  { name: "Amber", hex: "#FFBF00" },
  { name: "Blue", hex: "#4C8EF7" },
  { name: "Green", hex: "#4CAF50" },
  { name: "Yellow", hex: "#F2D94E" },
  { name: "Hazel", hex: "#8A6E3A" },
  { name: "Copper", hex: "#B87333" },
  { name: "Aqua", hex: "#4DD0E1" },
  { name: "Violet", hex: "#8B5CF6" },
];

export const FUR_COLOR_OPTIONS = [
  { name: "Black", hex: "#2F2F2F" },
  { name: "White", hex: "#F5F1EA" },
  { name: "Gray", hex: "#9AA0A6" },
  { name: "Brown", hex: "#8B5A2B" },
  { name: "Orange", hex: "#E67E22" },
  { name: "Cream", hex: "#F3E0B5" },
  { name: "Golden", hex: "#D4AF37" },
  { name: "Silver", hex: "#C0C0C0" },
  { name: "Calico", hex: "#D9A066" },
  { name: "Tortoiseshell", hex: "#A0522D" },
  { name: "Tabby", hex: "#B07B50" },
  { name: "Ginger", hex: "#C96F2D" },
];

export const BEHAVIOR_OPTIONS = [
  { name: "Friendly" },
  { name: "Shy" },
  { name: "Playful" },
  { name: "Calm" },
  { name: "Curious" },
  { name: "Affectionate" },
  { name: "Talkative" },
  { name: "Independent" },
  { name: "Nervous" },
  { name: "Aggressive" },
  { name: "Sleepy" },
  { name: "Social" },
];

export const splitSelections = (value) => {
  if (!value) return [];

  return String(value)
    .split(/\s*\/\s*|\s*,\s*/)
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item, index, array) => array.indexOf(item) === index);
};

export const joinSelections = (items) => items.filter(Boolean).join(" / ");
