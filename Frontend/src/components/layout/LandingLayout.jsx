import Header from "../common/HeaderLanding";
import Footer from "../common/Footer";
import Home from "@/pages/Home";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main>
        <Home />
        {children}
      </main>
      <Footer />
    </>
  );
}
