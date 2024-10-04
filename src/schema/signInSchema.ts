import * as z from "zod";
export const signInSchema = z.object({
  identifier: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});
