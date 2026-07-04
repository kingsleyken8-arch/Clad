import { useEffect, useState } from "react";
import LostHero from "./components/LostHero";
import VanGoghHero from "./components/VanGoghHero";

// Tiny hash router: "/" → LOST hero, "#/vangogh" (or legacy "#/nexmora")
// → Van Gogh hero.
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
  if (route.startsWith("#/vangogh") || route.startsWith("#/nexmora"))
    return <VanGoghHero />;
  return <LostHero />;
}
