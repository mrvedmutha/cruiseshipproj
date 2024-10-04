import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
export default async function SupervisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "SUPERVISOR") {
    return <div>Unauthorized</div>;
  }
  return (
    <>
      <h1>Hello this is manager</h1>
      {children}
    </>
  );
}
