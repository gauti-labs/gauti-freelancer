import { z } from "zod";

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(1200),
});

export const publicChatSchema = z.object({
  message: z
    .string()
    .trim()
    .min(2, "Please enter at least 2 characters.")
    .max(500, "Please keep the message under 500 characters."),
  history: z.array(chatMessageSchema).max(12).optional(),
});

export type PublicChatInput = z.infer<typeof publicChatSchema>;
