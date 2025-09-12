import CtaButton from "@/features/marketing/components/CTAButton";
import CursoDisponible from "@/features/marketing/components/CursoCard";
import HeroSection from "@/features/marketing/components/HeroSection";
import InstuctoresCard from "@/features/marketing/components/InstructoresCard";
import Price from "@/features/marketing/components/Price";
import TestimonioCard from "@/features/marketing/components/testimonioCard";


export default function Home() {
  return (
    <>
      <HeroSection />
     
      <CursoDisponible />
      <Price />
      <InstuctoresCard />
      <TestimonioCard />
      <CtaButton />
    </>
  );
}
