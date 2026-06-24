import Hero from "./components/Hero";
import About from "./components/About";
import Training from "./components/Training";
import Activity from "./components/Activity";
import Footer from "./components/Footer";
import ScrollCharacter from "./components/ScrollCharacter";

export default function App() {
  return (
    <div className="min-h-screen w-full bg-paper">
      {/* The travelling tennis player — follows the scroll and swaps poses. */}
      <ScrollCharacter />

      <Hero />
      <About />
      <Training />
      <Activity />
      <Footer />
    </div>
  );
}
