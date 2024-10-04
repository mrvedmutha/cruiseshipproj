import * as z from "zod";
export const categoryFormSchema = z.object({
  categoryName: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  categoryDescription: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" }),
  isProduct: z.boolean(),
});
