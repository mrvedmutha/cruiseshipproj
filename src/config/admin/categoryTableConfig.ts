import { ColumnDef } from "@tanstack/react-table";
import { ICategory } from "@/types/categoryInterface";

export const categoryColumns: ColumnDef<ICategory>[] = [
  {
    accessorKey: "categoryName",
    header: "Category Name",
  },
  {
    accessorKey: "categoryDescription",
    header: "Category Description",
  },
  {
    accessorKey: "isProduct",
    header: "Is Product",
    cell: ({ getValue }) => {
      const value = getValue();
      return value ? "Yes" : "No";
    },
  },
];

export default categoryColumns;
