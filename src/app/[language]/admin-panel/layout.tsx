// @next
import dynamic from "next/dynamic";

// @project
const AdminLayout = dynamic(() => import("@/layouts/AdminLayout"));

/***************************  LAYOUT - ADMIN  ***************************/

export default function Layout({ children }: any) {
  return <AdminLayout>{children}</AdminLayout>;
}
