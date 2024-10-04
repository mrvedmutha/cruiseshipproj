import { ColumnDef } from "@tanstack/react-table";
import { IProduct } from "@/types/productInterface";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import Image from "next/image";
export const productColumns: ColumnDef<IProduct>[] = [
  {
    accessorKey: "productImage",
    header: "Image",
    cell: ({ row }) => (
      <Image
        src={row.getValue<string>("productImage")}
        alt="Product Image"
        width={100}
        height={100}
      />
    ),
  },
  {
    accessorKey: "isAvailable",
    header: "Available",
    cell: ({ row }) => {
      return <Switch checked={row.getValue<boolean>("isAvailable")} disabled />;
    },
  },
  {
    accessorKey: "productName",
    header: "Product Name",
  },

  {
    accessorKey: "productPrice",
    header: "Price",
  },
];

export default productColumns;
