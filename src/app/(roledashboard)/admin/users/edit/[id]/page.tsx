"use client";
import React from "react";
import { EditUserForm } from "@/components/user/EditUserForm";
import { usePathname } from "next/navigation";

export default function EditUserPage() {
  const path = usePathname();
  const id = path.split("/").pop();
  console.log(`Pathname: ${path}`); //TODO Remove
  console.log(`id: ${id}`); //TODO Remove
  return (
    <div>
      <h1 className="font-extrabold text-xl">Edit User</h1>
      <EditUserForm userId={id as string} />
    </div>
  );
}
