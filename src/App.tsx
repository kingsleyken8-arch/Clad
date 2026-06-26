import WanderfulHero from "./components/WanderfulHero";
import TrustSection from "./components/TrustSection";
import ServicesSection from "./components/ServicesSection";
import ProgramsSection from "./components/ProgramsSection";
import ScheduleSection from "./components/ScheduleSection";
import CommunitySection from "./components/CommunitySection";

export default function App() {
  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-black text-white"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <WanderfulHero />
      <TrustSection />
      <ServicesSection />
      <ProgramsSection />
      <ScheduleSection />
      <CommunitySection />
    </div>
  );
}
