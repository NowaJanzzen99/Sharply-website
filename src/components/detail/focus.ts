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
  // Laptop and phone showing a site: the headline, the hero object, the phone.
  websites: [WHOLE, { x: 31, y: 38, zoom: 1.8 }, { x: 62, y: 42, zoom: 1.7 }, { x: 88, y: 56, zoom: 2.3 }],
  // A studio site, the assistant booking a workshop, the booking notice.
  aiChat: [WHOLE, { x: 22, y: 36, zoom: 1.7 }, { x: 72, y: 42, zoom: 1.9 }, { x: 60, y: 79, zoom: 2.3 }],
  // A shop: the product photo, the buy button, the product grid on the phone.
  webshop: [WHOLE, { x: 39, y: 40, zoom: 1.9 }, { x: 59, y: 42, zoom: 2.2 }, { x: 85, y: 50, zoom: 2.4 }],
  // An order in the middle of four systems: the order, the calendar and mail, the stock and invoices.
  integrations: [WHOLE, { x: 50, y: 52, zoom: 1.9 }, { x: 24, y: 28, zoom: 2.1 }, { x: 76, y: 76, zoom: 2.1 }],
  // An identity set: the mark on the bag, the colours, the typeface.
  branding: [WHOLE, { x: 14, y: 47, zoom: 1.8 }, { x: 47, y: 77, zoom: 2.1 }, { x: 77, y: 81, zoom: 2.3 }],
  // A campaign: the grid of photos, the story format, the video timeline.
  aiContent: [WHOLE, { x: 36, y: 40, zoom: 1.7 }, { x: 85, y: 60, zoom: 2.1 }, { x: 86, y: 73, zoom: 2.6 }],
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
  // Daalwerk is a scene, not a long page, so the picture is a strip of nine
  // screens of it, one per 16:11 window, in the order you meet them: hero,
  // shell, entrance, living room, kitchen, floor plan, the result, projects,
  // the assistant. The chapters stop on the hero, the living room, the result
  // and the assistant.
  daalwerk: [0, 0.375, 0.75, 1],
  // FlowDezk: ten screens in a strip, the chapters stop on the headline, the
  // quote being built, the price calculator and the request form.
  flowdezk: [0, 0.3333, 0.8889, 1],
};
