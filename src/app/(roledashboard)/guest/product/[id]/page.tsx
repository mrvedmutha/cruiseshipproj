"use client";
import React from "react";
import { SingleProduct } from "@/components/product/SingleProduct";
import { usePathname } from "next/navigation";

const SingleProductPage = () => {
  const path = usePathname();
  const id = path.split("/").pop();
  return <SingleProduct productId={id as string} />;
};

export default SingleProductPage;
