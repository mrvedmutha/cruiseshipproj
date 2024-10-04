import * as z from "zod";
export const productFormSchema = z.object({
  productName: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  productDescription: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" }),
  productPrice: z.string(),
  productImage: z.string().optional(),
  isAvailable: z.boolean(),
  category: z.string(),
  productAttributes: z.array(z.string()).optional(),
  isStockRequired: z.boolean(),
  stock: z.number(),
  isScheduledRequired: z.boolean(),
});
