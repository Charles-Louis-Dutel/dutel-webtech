import Header from "@/components/layout/Header";
import Folio from "@/components/layout/Folio";
import Footer from "@/components/layout/Footer";
import RevealObserver from "@/components/ui/RevealObserver";
import Hero from "@/components/sections/Hero";
import Realisation from "@/components/sections/Realisation";
import Services from "@/components/sections/Services";
import About from "@/components/sections/About";
import Method from "@/components/sections/Method";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Folio />
      <Header />
      <main id="contenu">
        <Hero />
        <Realisation />
        <Services />
        <About />
        <Method />
        <Contact />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
