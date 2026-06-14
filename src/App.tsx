import Hero from "./components/Hero";
import Compartments from "./components/Compartments";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen w-full bg-black">
      <Hero />
      <Compartments />
      <Footer />
    </div>
  );
}
