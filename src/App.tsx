import { lazy, Suspense, useEffect, useState } from "react";
import LostHero from "./components/LostHero";
import VanGoghHero from "./components/VanGoghHero";

const AthleteSite = lazy(() => import("./athlete/AthleteSite"));
const Studio = lazy(() => import("./studio/Studio"));

// Tiny hash router:
//   /             → LOST hero
//   #/vangogh     → Van Gogh hero (#/nexmora kept as an alias)
//   #/athlete     → athlete site
//   #/studio      → visual editor for the athlete site
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
  if (route.startsWith("#/studio"))
    return (
      <Suspense fallback={null}>
        <Studio />
      </Suspense>
    );
  if (route.startsWith("#/athlete"))
    return (
      <Suspense fallback={<div style={{ background: "#050505", height: "100vh" }} />}>
        <AthleteSite />
      </Suspense>
    );
  if (route.startsWith("#/vangogh") || route.startsWith("#/nexmora"))
    return <VanGoghHero />;
  return <LostHero />;
}
