import Hero from "./components/Hero";
import About from "./components/About";
import Training from "./components/Training";
import Activity from "./components/Activity";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen w-full bg-paper">
      <Hero />
      <About />
      <Training />
      <Activity />
      <Footer />
    </div>
  );
}
