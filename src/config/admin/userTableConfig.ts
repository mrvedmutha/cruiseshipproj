import { ColumnDef } from "@tanstack/react-table";
import { IUser } from "@/types/userInterface";

const userColumns: ColumnDef<IUser>[] = [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "accountCreated",
    header: "Account Created",
    cell: ({ getValue }) => new Date().toDateString(),
  },
  {
    accessorKey: "accountExpires",
    header: "Account Expires",
    cell: ({ getValue }) => {
      const value = getValue();
      return value ? new Date(value as string).toDateString() : "N/A";
    },
  },
];

export default userColumns;
