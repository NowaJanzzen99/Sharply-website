import { z } from "zod";

/** Shared by the browser and the route, so both refuse the same things. */
export const MAX_FILES = 3;
export const MAX_TOTAL_BYTES = 4 * 1024 * 1024;
export const ALLOWED_EXTENSIONS = [
  "pdf",
  "png",
  "jpg",
  "jpeg",
  "webp",
  "doc",
  "docx",
  "ppt",
  "pptx",
] as const;

export function extensionOf(name: string) {
  const dot = name.lastIndexOf(".");
  return dot === -1 ? "" : name.slice(dot + 1).toLowerCase();
}

export function isAllowedFile(name: string) {
  return (ALLOWED_EXTENSIONS as readonly string[]).includes(extensionOf(name));
}

const rowSchema = z.object({
  label: z.string().trim().min(1).max(200),
  value: z.string().trim().min(1).max(4000),
});

const sectionSchema = z.object({
  title: z.string().trim().min(1).max(120),
  rows: z.array(rowSchema).min(1).max(40),
});

export const contactSchema = z.object({
  lang: z.enum(["nl", "en"]),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  company: z.string().trim().max(160).default(""),
  consent: z.literal(true),
  sections: z.array(sectionSchema).min(1).max(16),
  /**
   * Honeypot: real people never see this field, so anything in it means a bot.
   * Accepted by the schema on purpose, then handled in the route.
   */
  website: z.string().max(200).optional(),
});

export type ContactPayload = z.infer<typeof contactSchema>;
