"use client";
import React from "react";
import { EditCategoryForm } from "@/components/category/EditCategoryForm";
import { usePathname } from "next/navigation";

export default function EditCategoryPage() {
  const path = usePathname();
  const id = path.split("/").pop();
  return (
    <div>
      <h1 className="font-extrabold text-xl">Edit Category</h1>
      <EditCategoryForm categoryId={id as string} />
    </div>
  );
}
