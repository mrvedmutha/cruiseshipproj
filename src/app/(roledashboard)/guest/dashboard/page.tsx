"use client";
import React, { useState, useEffect } from "react";
import { IProduct } from "@/types/productInterface";
import { getProductData } from "@/lib/admin/getProductData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GuestPage() {
  const [data, setData] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    getProductData()
      .then((fetchedData: IProduct[]) => {
        setData(fetchedData);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching data");
        setLoading(false);
      });
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
  return (
    <>
      <h1>Explore Products</h1>
      <div className="flex flex-wrap flex-wrap gap-5 p-5 justify-center">
        {data.map((product) => (
          <Card key={product._id} className="lg:w-1/4 md:w-1/3 w-full">
            <CardHeader>
              <CardContent>
                <Image
                  src={product?.productImage || "https://picsum.photos/300/300"}
                  alt="Product Image"
                  width={300}
                  height={300}
                />
              </CardContent>
            </CardHeader>
            <CardContent className="space-y-2">
              <CardTitle>{product.productName}</CardTitle>
              <p>Price: &#8377;{product.productPrice}</p>
              <p>Category: {product.category.categoryName}</p>
            </CardContent>
            <CardFooter>
              <Button variant="default" className="w-full">
                <Link href={`/guest/product/${product._id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
