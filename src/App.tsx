import CryptoxNav from "./components/cryptox/CryptoxNav";
import CryptoxHero from "./components/cryptox/CryptoxHero";
import TrustBar from "./components/cryptox/TrustBar";
import Features from "./components/cryptox/Features";

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink text-white">
      <CryptoxNav />
      <CryptoxHero />
      <TrustBar />
      <Features />
    </div>
  );
}
