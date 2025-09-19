import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "@/ui/common/Sidebar";
import { useEffect } from "react";
import { useAuth } from "@/contexts/useAuth";
import { useSidebar } from "@/shared/hooks/useSidebar";
import HeaderApp from "@/ui/common/HeaderApp";

export default function AppLayout() {
  const navigate = useNavigate();
  const { setLogoutCallback } = useAuth();
  const { isCollapsed } = useSidebar();

  useEffect(() => {
    // Set up the logout callback
    setLogoutCallback(() => {
      navigate("/login", { replace: true });
    });

    // Clean up the callback when component unmounts
    return () => setLogoutCallback(null);
  }, [navigate, setLogoutCallback]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar handles its own positioning and mobile behavior */}
      <Sidebar />


      {/* Main content */}
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          isCollapsed ? "lg:ml-16" : "lg:ml-64"
        }`}>
        <HeaderApp />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          <div className="container mx-auto px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
