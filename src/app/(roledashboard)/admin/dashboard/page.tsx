"use client";
import React, { useEffect, useState } from "react";
import ReusableTable from "@/components/table/ReuseableTable";
import { IUser } from "@/types/userInterface";
import getUserData from "@/lib/admin/getUserData";
import { ColumnDef } from "@tanstack/react-table";
import userColumnsConfig from "@/config/admin/userTableConfig";
import Link from "next/link";
import SearchInput from "@/components/table/SearchInput";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const [data, setData] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filteredData, setFilteredData] = useState<IUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const userColumns: ColumnDef<IUser>[] = [
    ...userColumnsConfig,
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <Link href={`/users/edit`}>Edit</Link>,
    },
  ];
  useEffect(() => {
    getUserData()
      .then((fetchedData: IUser[]) => {
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
    const filteredData = data.filter(
      (item) =>
        item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.includes(searchTerm) ||
        item.role.toLowerCase().includes(searchTerm)
    );
    setFilteredData(filteredData);
  }, [searchTerm, data]);

  if (loading) return <div>Loading...</div>;
  return (
    <>
      <div>
        <h1>User Table</h1>
        <div className="flex">
          <div className="mt-5 w-3/4 rounded-md">
            <SearchInput value={searchTerm} onChange={setSearchTerm} />
          </div>
          <Button variant="default">Add User</Button>
        </div>
        <ReusableTable<IUser>
          columns={userColumns}
          data={filteredData}
          model="User"
        />
      </div>
    </>
  );
}
