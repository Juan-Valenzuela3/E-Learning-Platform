import { Outlet } from "react-router-dom";
import { useSidebar } from "@/shared/hooks/useSidebar";
import Sidebar from "@/ui/common/Sidebar";
import HeaderApp from "@/ui/common/HeaderApp";

export default function AdminLayout() {

  const { isCollapsed } = useSidebar();

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      {/* Main content */}
      <div
        className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${
          isCollapsed ? "lg:ml-16" : "lg:ml-64"
        }`}>
        {/* Top navigation */}
        <HeaderApp />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-4 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
