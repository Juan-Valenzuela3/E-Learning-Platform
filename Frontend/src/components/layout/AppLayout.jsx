import HeaderApp from "@/components/common/HeaderApp";

export default function AppLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <HeaderApp />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}