import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Sidebar from "@/components/navbar/Sidebar";
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const accountNameShow = session?.user?.email ?? "Admin";
  if (session?.user?.role !== "ADMIN") {
    return <div>Unauthorized</div>;
  }
  return (
    <div className="flex">
      <div className="w-3/12">
        <Sidebar accountName={accountNameShow} />
      </div>

      <div className="mt-5 max-w-screen-xl p-5 w-full overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
