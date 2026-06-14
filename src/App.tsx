import Hero from "./components/Hero";
import Compartments from "./components/Compartments";
import Facilities from "./components/Facilities";
import CustomBike from "./components/CustomBike";
import Bento from "./components/Bento";
import RollOut from "./components/RollOut";
import ClosingCTA from "./components/ClosingCTA";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen w-full bg-black">
      <Hero />
      <Compartments />
      <Facilities />
      <CustomBike />
      <Bento />
      <RollOut />
      <ClosingCTA />
      <Footer />
    </div>
  );
}
