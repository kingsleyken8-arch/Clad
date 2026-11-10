import { lazy, Suspense, useEffect, useState } from "react";
import Site from "./clad/Site";

const LostHero = lazy(() => import("./components/LostHero"));
const VanGoghHero = lazy(() => import("./components/VanGoghHero"));
const Studio = lazy(() => import("./studio/Studio"));

// Tiny hash router:
//   /, #/menu, #/work …  → the studio site (it routes its own pages)
//   #/studio             → visual editor for the site
//   #/lost               → LOST hero
//   #/vangogh            → Van Gogh hero (#/nexmora kept as an alias)
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
  useEffect(() => {
    if (route.startsWith("#/studio")) document.title = "Studio — site editor";
    else if (route.startsWith("#/lost")) document.title = "LOST — Concept Not Found";
    else if (route.startsWith("#/vangogh") || route.startsWith("#/nexmora")) document.title = "Van Gogh";
  }, [route]);
  if (route.startsWith("#/studio"))
    return (
      <Suspense fallback={null}>
        <Studio />
      </Suspense>
    );
  if (route.startsWith("#/lost"))
    return (
      <Suspense fallback={null}>
        <LostHero />
      </Suspense>
    );
  if (route.startsWith("#/vangogh") || route.startsWith("#/nexmora"))
    return (
      <Suspense fallback={null}>
        <VanGoghHero />
      </Suspense>
    );
  return <Site />;
}
