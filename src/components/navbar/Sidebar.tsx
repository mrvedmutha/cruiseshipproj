"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { Moon, Sun, CircleUserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Package,
  SquareArrowUpRight,
  HandCoins,
  Users,
  ScanEye,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NavItem from "@/components/navbar/NavbarItem";
import "@/app/globals.css";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";

const sideMenus = [
  { label: "Dashboard", path: "/admin/dashboard", Icon: LayoutDashboard },
  { label: "Users", path: "/admin/users", Icon: Users },
  { label: "Products", path: "/admin/products", Icon: Package },
  { label: "Categories", path: "/admin/category", Icon: HandCoins },
];
export default function Sidebar({ accountName }: { accountName: string }) {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme("system");
  }, [setTheme]);
  const handleSignOut = async () => {
    await signOut();
    location.reload();
  };

  return (
    <div className="flex fixed min-h-screen w-1/4">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-semibold"
            >
              <ScanEye className="h-6 w-6" />
              <span className="">CRUIZE BRUS</span>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-auto w-8 h-8"
                >
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex-1 mt-3">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {sideMenus.map((menu) => (
                <NavItem key={menu.label} {...menu} />
              ))}
            </nav>
          </div>
          <div className="flex-end mt-auto p-4">
            <Card className="w-full">
              <div className="flex">
                <CardContent className="mt-4 w-0">
                  <CircleUserRound className=" h-6 w-6" />
                </CardContent>
                <CardContent className="mt-4 text-sm">
                  {accountName}
                </CardContent>
              </div>
              <div className="flex justify-center items-center  w-full">
                <Button
                  className="w-4/5 h-8 mb-4"
                  variant="default"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
