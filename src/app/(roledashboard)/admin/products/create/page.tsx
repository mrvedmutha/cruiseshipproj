import React from "react";
import { ProductForm } from "@/components/product/ProductForm";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="font-extrabold text-xl">Create User</h1>
      <ProductForm />
    </div>
  );
}
