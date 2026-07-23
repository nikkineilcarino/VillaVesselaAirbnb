import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().trim().min(1).max(254).email(),
  password: z.string().min(1).max(256),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
