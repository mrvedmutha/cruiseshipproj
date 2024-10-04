"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FC } from "react";

// Define the props interface
export interface NavItemProps {
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  path: string;
  onClick?: () => void;
}

// Use the interface in the component function
const NavItem: FC<NavItemProps> = ({ label, Icon, path, onClick }) => {
  const pathname = usePathname();

  return (
    <Link
      href={path}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-muted-foreground hover:text-primary",
        {
          "bg-primary text-black dark:bg-primary dark:text-grey hover:text-black dark:hover:text-zinc-800":
            pathname === path,
        }
      )}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
};

export default NavItem;
