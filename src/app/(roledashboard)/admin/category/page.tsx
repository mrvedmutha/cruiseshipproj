"use client";
import React, { useEffect, useState } from "react";
import ReusableTable from "@/components/table/ReuseableTable";
import { ICategory } from "@/types/categoryInterface";
import { getCategoryData } from "@/lib/admin/getCategoryData";
import { ColumnDef } from "@tanstack/react-table";
import categoryColumnsConfig from "@/config/admin/categoryTableConfig";
import Link from "next/link";
import SearchInput from "@/components/table/SearchInput";
import { Button } from "@/components/ui/button";
import { DropDownOptions } from "@/components/DropDownOptions/DropDownOptions";

export default function CategoryPage() {
  const [data, setData] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filteredData, setFilteredData] = useState<ICategory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const categoryColumns: ColumnDef<ICategory>[] = [
    ...categoryColumnsConfig,
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.original._id;
        return (
          <DropDownOptions
            pageName="category"
            row={row}
            linkUrl={`/admin/category/edit/${id}`}
          />
        );
      },
    },
  ];
  useEffect(() => {
    getCategoryData()
      .then((fetchedData: ICategory[]) => {
        setData(fetchedData);
        setFilteredData(fetchedData);
        setLoading(false);
      })
      .catch((error: Error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    const filteredData = data.filter((item) =>
      item.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filteredData);
  }, [data, searchTerm]);
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div>
        <h1>Category Table</h1>
        <div className="flex items-center place-items-center space-x-8 mt-5">
          <div className="w-3/4 rounded-md">
            <SearchInput value={searchTerm} onChange={setSearchTerm} />
          </div>
          <div className="w-3/12">
            <Button className="w-full" variant="default">
              <Link href="/admin/category/create">Create Category</Link>
            </Button>
          </div>
        </div>
        <ReusableTable<ICategory>
          data={filteredData}
          columns={categoryColumns}
          model="category"
        />
      </div>
    </>
  );
}
