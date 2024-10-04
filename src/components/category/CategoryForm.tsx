"use client";
import * as react from "react";
import { categoryFormSchema } from "@/schema/categoryFormSchema";
import { ICategory } from "@/types/categoryInterface";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import axios from "axios";
import * as z from "zod";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "../ui/button";

export default function CategoryForm() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      categoryName: "",
      categoryDescription: "",
      isProduct: false,
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof categoryFormSchema>> = async (
    data
  ) => {
    try {
      const { categoryName, categoryDescription, isProduct } = data;
      await axios.post("/api/category/create", {
        categoryName,
        categoryDescription,
        isProduct,
      });
      toast({
        variant: "default",
        title: "Category created successfully",
        description: "We've created your category for you.",
        action: <ToastAction altText="dismiss">Dismiss</ToastAction>,
      });
      router.push("/admin/category");
    } catch (error: any) {
      return toast({
        variant: "destructive",
        title: "Error occured while creating category",
        description: error.message,
      });
    }
  };

  return (
    <div className="p-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="categoryName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Category Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter Category Description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isProduct"
            render={({ field }) => (
              <FormItem>
                <div className="flex space-x-4 place-items-end">
                  <FormLabel>Is Product? (Click if yes)</FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
