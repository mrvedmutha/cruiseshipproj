import * as z from "zod";
export const userFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" }),
  fullName: z.string(),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  role: z.string(),
  accountExpires: z.date().nullable(),
});

export const emailValidationSchema = z
  .string()
  .email({ message: "Invalid email address" });
