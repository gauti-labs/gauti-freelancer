import { z } from "zod";

export const publicChatSchema = z.object({
  message: z
    .string()
    .trim()
    .min(2, "Please enter at least 2 characters.")
    .max(500, "Please keep the message under 500 characters."),
});

export type PublicChatInput = z.infer<typeof publicChatSchema>;
