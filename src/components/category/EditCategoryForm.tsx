"use client";
import { categoryFormSchema } from "@/schema/categoryFormSchema";
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
import * as React from "react";
import { ICategory } from "@/types/categoryInterface";

interface EditCategoryFormProps {
  categoryId: string;
}

interface IApiEditResponse<T> {
  data: T;
}

export function EditCategoryForm({ categoryId }: EditCategoryFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      categoryName: "",
      categoryDescription: "",
      isProduct: false,
    },
  });
  React.useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get<IApiEditResponse<ICategory>>(
          `/api/category/${categoryId}`
        );
        const categoryData = res.data.data;
        console.log("Fetched category data: ", categoryData); //TODO remove
        form.setValue("categoryName", categoryData.categoryName);
        form.setValue("categoryDescription", categoryData.categoryDescription);
        form.setValue("isProduct", categoryData.isProduct);
      } catch (error: any) {
        console.error("Error fetching category: ", error.message);
      }
    };

    fetchCategory();
  }, [categoryId, form]);

  const onSubmit: SubmitHandler<z.infer<typeof categoryFormSchema>> = async (
    data
  ) => {
    setIsLoading(true);
    try {
      const resultData = await axios.put<ICategory>(
        `/api/category/${categoryId}`,
        data
      );
      if (!resultData) {
        toast({
          variant: "destructive",
          title: "Error occured",
          description: "Error while updating category",
        });
      }
      console.log(resultData); //TODO remove
      await router.push("/admin/category");
      toast({
        variant: "default",
        title: "Category updated",
        description: "Category has baeen updated successfully",
        action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
      });
      toast({
        title: "Category created successfully",
        description: "We've created your category for you.",
        action: <ToastAction altText="View category">Dismiss</ToastAction>,
      });
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
