import type { Focus } from "./DetailScrolly";

/*
  Where the camera looks, per chapter, for every detail page that uses a single
  picture. Percentages of the picture, and how far in to go. The first stop is
  always the whole picture, so each page opens on the full view before it
  starts pointing at things.

  These follow the pictures, not the words: if a picture is replaced, these
  are the numbers to revisit.
*/
const WHOLE: Focus = { x: 50, y: 50, zoom: 1 };

export const FOCUS: Record<string, Focus[]> = {
  // A page layout: the header, the cards, the lines of text.
  websites: [WHOLE, { x: 32, y: 12, zoom: 1.7 }, { x: 52, y: 60, zoom: 1.55 }, { x: 42, y: 86, zoom: 1.65 }],
  // A chat: the lit bubble, the assistant, the input.
  aiChat: [WHOLE, { x: 46, y: 46, zoom: 1.6 }, { x: 16, y: 52, zoom: 1.9 }, { x: 52, y: 82, zoom: 1.6 }],
  // A shop: the lifted product, the bag, the product beside it.
  webshop: [WHOLE, { x: 50, y: 42, zoom: 1.55 }, { x: 70, y: 74, zoom: 1.7 }, { x: 20, y: 46, zoom: 1.6 }],
  // Wired systems: the hub, a tile, another tile.
  integrations: [WHOLE, { x: 50, y: 48, zoom: 1.7 }, { x: 20, y: 72, zoom: 1.8 }, { x: 86, y: 38, zoom: 1.7 }],
  // An identity kit: the mark, the swatches, the plates.
  branding: [WHOLE, { x: 50, y: 46, zoom: 1.7 }, { x: 24, y: 30, zoom: 1.8 }, { x: 78, y: 40, zoom: 1.6 }],
  // Frames being made: the play frame, the particles, the grid.
  aiContent: [WHOLE, { x: 42, y: 56, zoom: 1.7 }, { x: 80, y: 46, zoom: 1.8 }, { x: 30, y: 22, zoom: 1.6 }],
};

/*
  For a real site scrolling inside its window: how far down the page each
  chapter stops, as a fraction of how far the page can scroll. Measured on the
  live site at 1440 wide (page 10602 tall; #formaten at 5488, #boeken at 8670)
  and converted for a 16:11 window, so each chapter lands on what it names.
*/
export const PAGE_STOPS: Record<string, number[]> = {
  // The paintings in the hero, the format picker, the booking form.
  liveweddingpaintings: [0, 0.566, 0.848],
  // Measured on the live site at 1200 wide in a 16:11 window (page 6914 tall,
  // so 6089 of travel): the hero timeline, the four feature cards, the
  // assistant, the price list.
  renofloww: [0, 0.3345, 0.4762, 0.7226],
};
