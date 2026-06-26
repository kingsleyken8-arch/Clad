import WanderfulHero from "./components/WanderfulHero";
import TrustSection from "./components/TrustSection";
import ServicesSection from "./components/ServicesSection";

export default function App() {
  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-black text-white"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <WanderfulHero />
      <TrustSection />
      <ServicesSection />
    </div>
  );
}
