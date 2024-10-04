"use client";
import React from "react";
import { EditProductForm } from "@/components/product/EditProductForm";
import { usePathname } from "next/navigation";

export default function Page() {
  const path = usePathname();
  const id = path.split("/").pop();
  return (
    <div>
      <h1 className="font-extrabold text-xl">Edit Product</h1>
      <EditProductForm productId={id as string} />
    </div>
  );
}
