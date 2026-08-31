import { z } from "zod";

export const projectBriefSchema = z.object({
  brief: z
    .string()
    .trim()
    .min(20, "Please describe your project in at least 20 characters.")
    .max(2000, "Please keep the brief under 2,000 characters."),
});

export type ProjectBriefInput = z.infer<typeof projectBriefSchema>;
