import HeroSection from "./Sections/Herosection";
import FeaturesSection from "./Sections/FeaturesSection";
import Pricing from "./Sections/Pricing";
import Reviews from "./Sections/Reviews";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center overflow-x-hidden bg-background">
      <HeroSection />
      <FeaturesSection />
      <Reviews />
      <Pricing />
    </main>
  );
}
