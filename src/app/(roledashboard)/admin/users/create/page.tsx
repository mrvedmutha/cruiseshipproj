import React from "react";
import { UserForm } from "@/components/user/UserForm";
import { User } from "lucide-react";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="font-extrabold text-xl">Create User</h1>
      <UserForm />
    </div>
  );
}
