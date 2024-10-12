"use client";
import * as react from "react";
import { productFormSchema } from "@/schema/productFormSchema";
import { IProduct } from "@/types/productInterface";
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
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";

interface EditProductFormProps {
  productId: string;
}
interface IApiEditResponse<T> {
  data: T;
}
export function EditProductForm({ productId }: EditProductFormProps) {
  const router = useRouter();
  const [category, setCategory] = react.useState<any[]>([]);
  const [isLoading, setIsLoading] = react.useState(false);
  const [selectedFile, setSelectedFile] = react.useState<File | null>(null);
  const [attributes, setAttributes] = react.useState<any[]>([]);
  const [newValue, setNewValue] = react.useState("");
  const { toast } = useToast();
  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      productName: "",
      productDescription: "",
      productPrice: "",
      productImage: "",
      isAvailable: true,
      category: "",
      stock: "",
      productAttributes: [],
      isScheduledRequired: false,
    },
  });

  react.useEffect(() => {
    console.log("Is form valid:", form.formState.isValid);
    console.log(form.formState.errors);
    const fetchCategory = async () => {
      try {
        const res = await axios.get(`/api/category`);
        const categoryData = res.data.data;
        setCategory(categoryData);
      } catch (error: any) {
        console.error("Error fetching category: ", error.message);
      }
    };
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${productId}`);
        const productData = res.data.data;
        //console.log("Fetched product data: ", productData); //TODO remove
        form.setValue("productName", productData.productName);
        form.setValue("productDescription", productData.productDescription);
        form.setValue("productPrice", productData.productPrice.toString());
        form.setValue("productImage", productData.productImage);
        form.setValue("isAvailable", productData.isAvailable);
        form.setValue("category", productData.category);
        setAttributes(productData.productAttributes || []);
        // console.log("Attributes set: ", productData.productAttributes); //TODO remove
        form.setValue("stock", productData.stock.toString());
        form.setValue("isScheduledRequired", productData.isScheduledRequired);
      } catch (error: any) {
        console.error("Error fetching product: ", error.message);
      }
    };
    fetchCategory();
    fetchProduct();
    // }, [productId, form, form.formState.isValid, form.formState.errors]); //TODO Alternate debugging method
  }, [productId, form]);
  const imageHandleFileChange = (e: react.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;
    if (file && file[0]) {
      setSelectedFile(file[0]);
    }
  };
  const handleAddAttribute = () => {
    setAttributes([...attributes, { name: "", values: [] }]);
  };

  const handleAttributeChange = (index: number, key: string, value: string) => {
    const newAttributes = [...attributes];
    newAttributes[index][key] = value;
    setAttributes(newAttributes);
  };

  const handleRemoveAttribute = (index: number) => {
    const newAttributes = attributes.filter((_, i) => i !== index);
    setAttributes(newAttributes);
  };

  const handleRemoveValue = (attrIndex: number, valueIndex: number) => {
    const newAttributes = [...attributes];
    newAttributes[attrIndex].values.splice(valueIndex, 1);
    setAttributes(newAttributes);
  };
  const onSubmit: SubmitHandler<z.infer<typeof productFormSchema>> = async (
    data
  ) => {
    console.log("Submitted data: ", data);
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("productName", data.productName);
      formData.append("productDescription", data.productDescription);
      formData.append("productPrice", data.productPrice);
      formData.append("isAvailable", data.isAvailable ? "true" : "false");
      formData.append("category", data.category);
      formData.append("stock", data.stock.toString());
      formData.append(
        "isScheduledRequired",
        data.isScheduledRequired ? "true" : "false"
      );
      const attributesOfProduct = formData.append(
        "productAttributes",
        JSON.stringify(attributes)
      );
      console.log(`attributesOfProduct: ${attributesOfProduct}`); //TODO remove
      const fileInput =
        (document.getElementById("productImage") as HTMLInputElement).files ||
        null;
      // console.log(fileInput); //TODO remove
      if (fileInput && fileInput[0]) {
        formData.append("productImage", fileInput[0]);
      }

      // console.log({ data }); //TODO remove
      const resultData = await axios.put<IProduct>(
        `/api/products/${productId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response from server: ", resultData); //TODO remove
      if (!resultData) {
        toast({
          variant: "destructive",
          title: "Error occured while creating product",
          description: "Error while updating product",
        });
      }
      // console.log(resultData); //TODO remove
      await router.push("/admin/products");
      toast({
        variant: "default",
        title: "Product updated",
        description: "Product has baeen updated successfully",
        action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
      });
      router.push("/admin/products");
    } catch (error: any) {
      return toast({
        variant: "destructive",
        title: "Error occured while creating product",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };
  console.log("Form is being rendered"); //TODO remove
  return (
    <div className="p-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="productName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Product Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="productDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter Product Description..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="productPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Product Price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="productImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Image</FormLabel>
                <FormControl>
                  <Input
                    id="productImage"
                    type="file"
                    onChange={imageHandleFileChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isAvailable"
            render={({ field }) => (
              <FormItem>
                <div className="flex space-x-4 place-items-end">
                  <FormLabel>Is Available</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="productAttributes"
            render={() => (
              <FormItem>
                <FormLabel>Product Attributes</FormLabel>

                {attributes.map((attribute, index) => (
                  <div key={index} className="space-y-2 mb-4">
                    {/* Attribute Name Input */}
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="Attribute Name"
                          value={attribute.name || ""}
                          onChange={(e) =>
                            handleAttributeChange(index, "name", e.target.value)
                          }
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => handleRemoveAttribute(index)}
                        >
                          ✕
                        </Button>
                      </div>
                    </FormControl>

                    {/* Add Attribute Values */}
                    <div className="space-y-2">
                      <FormControl>
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Add Attribute Value"
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            onClick={() => {
                              if (newValue.trim()) {
                                const updatedAttributes = [...attributes];
                                updatedAttributes[index].values.push(
                                  newValue.trim()
                                );
                                setAttributes(updatedAttributes);
                                setNewValue("");
                              }
                            }}
                          >
                            Add Value
                          </Button>
                        </div>
                      </FormControl>

                      {/* Display Values as Badges */}
                      <div className="flex flex-wrap space-x-2">
                        {attribute.values.map(
                          (value: string, valueIndex: number) => (
                            <Badge
                              key={valueIndex}
                              className="flex items-center"
                            >
                              {value}
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleRemoveValue(index, valueIndex)
                                }
                                className="ml-2"
                              >
                                ✕
                              </Button>
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  onClick={handleAddAttribute}
                  className="mt-2"
                >
                  Add Attribute
                </Button>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {category.map((category: any) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.categoryName}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Stock" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isScheduledRequired"
            render={({ field }) => (
              <FormItem>
                <div className="flex space-x-4 place-items-end">
                  <FormLabel>Is Scheduled Required: check if yes</FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            variant="default"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Product"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
