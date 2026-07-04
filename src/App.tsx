import { useEffect, useState } from "react";
import LostHero from "./components/LostHero";
import NexmoraHero from "./components/NexmoraHero";

// Tiny hash router: "/" → LOST hero, "#/nexmora" → Nexmora hero.
function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return hash;
}

export default function App() {
  const route = useHashRoute();
  if (route.startsWith("#/nexmora")) return <NexmoraHero />;
  return <LostHero />;
}
