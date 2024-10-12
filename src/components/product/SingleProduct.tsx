"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { IProduct } from "@/types/productInterface";
import { getSingleProductData } from "@/lib/admin/getProductData";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { Plus, Minus } from "lucide-react";
import { Input } from "../ui/input";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";

export function SingleProduct({ productId }: { productId: string }) {
  const [product, setProduct] = React.useState<IProduct>();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [quantity, setQuantity] = React.useState(1);
  const [selectedAttribute, setSelectedAttribute] = React.useState<string[]>(
    []
  );
  const { toast } = useToast();

  React.useEffect(() => {
    getSingleProductData(productId)
      .then((fetchedData: IProduct) => {
        setProduct(fetchedData);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, [productId]);
  const handleQtyChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };
  const { data: session } = useSession();
  const handlePlaceOrder = async () => {
    if (product && (product.stock ?? 0) < quantity) {
      toast({
        title: "Error",
        description: "Product out of stock",
        variant: "destructive",
      });
      return;
    }
    try {
      const attributeKeys = Object.keys(selectedAttribute);
      const formattedAttributes = Object.keys(selectedAttribute).map(
        (key: any) => ({
          [key]: selectedAttribute[key],
        })
      );
      console.log({ attributeKeys });
      console.log({ formattedAttributes });
      const orderData = {
        orderDate: new Date(Date.now()),
        status: "PENDING",
        user: session?.user?._id,
        products: [
          {
            product: {
              _id: product?._id,
            },
            quantity: quantity,
            orderProductAttributes: formattedAttributes,
          },
        ],
      };
      console.log("Order data: ", { orderData });
      const res = axios.post("/api/orders/create", orderData);
      console.log({ res }); //TODO remove
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className="flex gap-5 p-14 xs:flex-col md:flex-row">
          <div className="flex gap-5 w-2/5 md:w-full lg: xs:w-full mx-auto place-content-center">
            <Image
              src={product?.productImage ?? ""}
              alt="product image"
              width={500}
              height={100}
            />
          </div>
          <div className="flex flex-col gap-5 w-full">
            <div className="flex flex-col divide-solid divide-y-2 gap-3">
              <h1 className="text-4xl font-bold w-full">
                {product?.productName}
              </h1>
              <p className="text-3xl font-bold">
                &#8377;{product?.productPrice}.00
              </p>
            </div>
            <p className="text-2xl w-3/4">{product?.productDescription}</p>
            <p className="text-2xl w-3/4">{product?.category.categoryName}</p>
            <p className="text-lg font-bold w-3/4">Stock: {product?.stock}</p>
            {product?.productAttributes?.map((productAttributes) => (
              <Select
                key={productAttributes._id}
                onValueChange={(val) => {
                  setSelectedAttribute((prev) => ({
                    ...prev,
                    [productAttributes._id]: val,
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={`Select ${productAttributes.name}`}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {productAttributes.values.map((value: any) => (
                      <SelectItem key={value.trim()} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            ))}
            {product?.isScheduledRequired && (
              <div className="flex w-100 place-items-center">
                <div className="w-2/5">
                  <p className="text-lg">Select Date & Time</p>
                </div>
                <div className="w-3/5">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !product?.isScheduledRequired &&
                            "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />:{" "}
                        <span>Pick a date</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Time" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="0">Today</SelectItem>
                          <SelectItem value="1">Tomorrow</SelectItem>
                          <SelectItem value="3">In 3 days</SelectItem>
                          <SelectItem value="7">In a week</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="rounded-md border">
                        <Calendar mode="single" />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
            <div className="flex md:flex-row xs:flex-col xs:space-y-5 md:space-y-0 space-x-5 place-items-center">
              <div className="flex md:w-1/2 lg:w-2/5 space-x-5 xs:space-evenly">
                <Button variant="secondary" onClick={() => handleQtyChange(1)}>
                  <Plus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  className="text-center"
                  onChange={(e) => {
                    setQuantity(Number(e.target.value));
                  }}
                  min={1}
                />
                <Button
                  variant="secondary"
                  onClick={() => handleQtyChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
              <div className="w-full md:w-1/2">
                <Button className="w-full" onClick={handlePlaceOrder}>
                  Place Order
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
