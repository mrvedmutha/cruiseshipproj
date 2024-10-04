"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FC } from "react";

export interface TopNavItemProps {
  id: string;
  label: string;
  path: string;
}

export const TopNavItem: FC<TopNavItemProps> = ({ id, label, path }) => {
  const pathname = usePathname();
  return (
    <Link
      id={id}
      href={path}
      className={cn(
        "text-muted-foreground transition-colors hover:text-foreground",
        {
          "text-foreground transition-colors hover:text-foreground":
            pathname === path,
        }
      )}
    >
      {label}
    </Link>
  );
};
