import { useEffect, useState } from "react";
import AceBreaker from "./components/AceBreaker";
import VertexSite from "./components/VertexSite";

/**
 * Tiny hash router so both experiences ship from one build:
 *   (default) -> the VertexAI website (Higgsfield painting hero)
 *   #/game    -> the Ace Breaker game
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
  if (hash.startsWith("#/game") || hash.startsWith("#game")) return <AceBreaker />;
  return <VertexSite />;
}
