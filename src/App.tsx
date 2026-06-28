import { useEffect, useState } from "react";
import AceBreaker from "./components/AceBreaker";
import VertexHero from "./components/VertexHero";

/**
 * Tiny hash router so both experiences ship from one build:
 *   #/hero  -> the VertexAI hero section (Higgsfield painting background)
 *   (default) -> the Ace Breaker game
 */
function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return hash;
}

export default function App() {
  const hash = useHashRoute();
  if (hash.startsWith("#/hero") || hash.startsWith("#hero")) return <VertexHero />;
  return <AceBreaker />;
}
