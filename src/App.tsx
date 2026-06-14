import Hero from "./components/Hero";
import Compartments from "./components/Compartments";
import Bento from "./components/Bento";
import ClosingCTA from "./components/ClosingCTA";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen w-full bg-black">
      <Hero />
      <Compartments />
      <Bento />
      <ClosingCTA />
      <Footer />
    </div>
  );
}
