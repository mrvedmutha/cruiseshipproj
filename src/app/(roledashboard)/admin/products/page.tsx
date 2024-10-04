"use client";
import React, { useEffect, useState } from "react";
import ReusableTable from "@/components/table/ReuseableTable";
import { IProduct } from "@/types/productInterface";
import { getProductData } from "@/lib/admin/getProductData";
import { getCategoryData } from "@/lib/admin/getCategoryData"; // Import category fetching
import { ColumnDef } from "@tanstack/react-table";
import productColumnsConfig from "@/config/admin/productTableConfig";
import Link from "next/link";
import SearchInput from "@/components/table/SearchInput";
import { Button } from "@/components/ui/button";
import { DropDownOptions } from "@/components/DropDownOptions/DropDownOptions";

export default function ProductsPage() {
  const [data, setData] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<any[]>([]); // State for categories
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filteredData, setFilteredData] = useState<IProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          getProductData(),
          getCategoryData(),
        ]);
        console.log({ fetchedProducts, fetchedCategories });
        setData(fetchedProducts);
        setCategories(fetchedCategories);
        setFilteredData(fetchedProducts);
        setLoading(false);
      } catch (error) {
        setError("Error fetching data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filteredData = data.filter((item) =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filteredData);
  }, [searchTerm, data]);

  const productColumns: ColumnDef<IProduct>[] = [
    ...productColumnsConfig,
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const categoryId = row.original.category;
        const category = categories.find((cat) => cat._id === categoryId);
        return <span>{category ? category.categoryName : "Unknown"}</span>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.original._id;
        return (
          <DropDownOptions
            row={row}
            linkUrl={`/admin/products/edit/${id}`}
            pageName="products"
          />
        );
      },
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Product Table</h1>
      <div className="flex items-center place-items-center space-x-8 mt-5">
        <div className="w-3/4 rounded-md">
          <SearchInput value={searchTerm} onChange={setSearchTerm} />
        </div>
        <div className="w-3/12">
          <Button className="w-full" variant="default" asChild>
            <Link href="/admin/products/create">Create Product</Link>
          </Button>
        </div>
      </div>
      <ReusableTable<IProduct>
        data={filteredData}
        columns={productColumns}
        model="Products"
      />
    </div>
  );
}
