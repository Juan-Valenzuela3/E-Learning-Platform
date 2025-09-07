import CtaButton from "@/components/Landing/CTAButton";
import CursoDisponible from "@/components/Landing/CursoCard";
import HeroSection from "@/components/Landing/HeroSection";
import InstuctoresCard from "@/components/Landing/InstructoresCard";
import Price from "@/components/Landing/Price";
import TestimonioCard from "@/components/Landing/testimonioCard";


export default function Home() {
  return (
    <>
     <HeroSection/>
     <CursoDisponible/>
     <Price/>
     <InstuctoresCard/>
     <TestimonioCard/>
     <CtaButton/>
    </>



  );
}
