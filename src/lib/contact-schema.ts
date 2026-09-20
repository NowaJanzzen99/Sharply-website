import { z } from "zod";

export const contactSchema = z.object({
  needs: z.array(z.string().max(60)).min(1).max(12),
  project: z.string().trim().min(10).max(4000),
  references: z.string().trim().max(2000).default(""),
  budget: z.string().trim().min(1).max(60),
  timeline: z.string().trim().min(1).max(60),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  company: z.string().trim().max(160).default(""),
  phone: z.string().trim().max(60).default(""),
  lang: z.enum(["nl", "en"]),
  /**
   * Honeypot: real people never see this field, so anything in it means a bot.
   * Accepted by the schema on purpose, then handled in the route.
   */
  website: z.string().max(200).optional(),
});

export type ContactPayload = z.infer<typeof contactSchema>;
