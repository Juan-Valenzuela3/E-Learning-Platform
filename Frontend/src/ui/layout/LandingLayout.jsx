import Header from "@/ui/common/HeaderLanding";
import Footer from "@/ui/common/Footer";
import { Outlet } from 'react-router-dom';
import AnimatedBackground from "@/shared/components/AnimatedBackground";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedBackground variant="subtle" />
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
