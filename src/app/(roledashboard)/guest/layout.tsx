import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import TopNavbar from "@/components/TopNavbar/TopNavbar";
export default async function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navMenu = [
    { id: "Home", label: "Home", path: "/guest/dashboard" },
    { id: "food", label: "Order Food", path: "/guest/products/food" },
    {
      id: "services",
      label: "Book Services",
      path: "/guest/products/services",
    },
    {
      id: "stationery",
      label: "Order Stationery",
      path: "/guest/products/stationery",
    },
  ];
  const session = await getServerSession(authOptions);
  const sessionUserName = session?.user?.fullName;
  const message = { message: "Unauthorized" };
  if (session?.user?.role !== "GUEST") {
    return <div>Unauthorized</div>;
  }
  return (
    <>
      <TopNavbar
        menu={navMenu}
        accountName={sessionUserName as string}
        homeLink="/guest/dashboard"
      />
      {children}
    </>
  );
}
