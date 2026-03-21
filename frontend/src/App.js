// src/App.jsx
// Complete app flow:
//   AuthPage → WeatherLanding → OccasionExplorer
//     → OccasionDetailPage → OutfitRecommendationPage → PriceComparisonPage
//     → AIStylingPage
//     → WardrobePage (accessible from nav anywhere)

import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import AuthPage                from "./pages/AuthPage";
import WeatherLanding          from "./pages/WeatherLanding";
import OccasionExplorer        from "./pages/OccasionExplorer";
import OccasionDetailPage      from "./pages/OccasionDetailPage";
import OutfitRecommendationPage from "./pages/OutfitRecommendationPage";
import PriceComparisonPage     from "./pages/PriceComparisonPage";
import AIStylingPage           from "./pages/AIStylingPage";
import WardrobePage            from "./pages/WardrobePage";

// ── Step constants ────────────────────────────────────────────────────────────
const STEP = {
  AUTH:       "auth",
  WEATHER:    "weather",
  EXPLORER:   "explorer",       // occasion grid
  OCCASION:   "occasion",       // sub-occasion list (Formal → Business Meeting, etc.)
  OUTFIT:     "outfit",         // full outfit recommendation
  PRICE:      "price",          // price comparison
  AI_STYLING: "ai_styling",     // AI styling page
  WARDROBE:   "wardrobe",       // my wardrobe
};

function AppInner() {
  const { user, loading, logout } = useAuth();

  // ── Navigation state ──────────────────────────────────────────
  const [step, setStep]           = useState(STEP.WEATHER);
  const [history, setHistory]     = useState([]);          // breadcrumb stack

  // ── Domain state ──────────────────────────────────────────────
  const [weather, setWeather]     = useState(null);
  const [occasion, setOccasion]   = useState(null);         // e.g. "formal"
  const [subOccasion, setSubOccasion] = useState(null);     // { id, label }
  const [currentOutfit, setCurrentOutfit] = useState(null); // outfit object for price page

  if (loading) return <LoadingScreen />;

  // ── Navigation helpers ────────────────────────────────────────
  const go = (newStep) => {
    setHistory(h => [...h, step]);
    setStep(newStep);
  };

  const goBack = () => {
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setStep(prev || STEP.WEATHER);
  };

  // ── Handlers ──────────────────────────────────────────────────
  const handleWeatherSelect = (w) => {
    setWeather(w);
    go(STEP.EXPLORER);
  };

  // OccasionExplorer → OccasionDetailPage (on card click)
  const handleOccasionSelect = (occId) => {
    setOccasion(occId);
    go(STEP.OCCASION);
  };

  // OccasionDetailPage → OutfitRecommendationPage
  const handleSubOccasionSelect = (occId, subId, subLabel) => {
    setOccasion(occId);
    setSubOccasion({ id: subId, label: subLabel });
    go(STEP.OUTFIT);
  };

  // OutfitRecommendationPage → PriceComparisonPage
  const handlePriceCompare = (outfit) => {
    setCurrentOutfit(outfit);
    go(STEP.PRICE);
  };

  // Any page → AIStylingPage
  const handleCustomize = (occId) => {
    setOccasion(occId || occasion);
    go(STEP.AI_STYLING);
  };

  // Nav Wardrobe link
  const handleWardrobe = () => go(STEP.WARDROBE);

  const handleLogin = () => go(STEP.AUTH);

  return (
    <>
      {/* Floating top bar — hidden on auth page */}
      {step !== STEP.AUTH && (
        <GlobalNav
          user={user}
          onLogin={handleLogin}
          onLogout={logout}
          onWardrobe={handleWardrobe}
          onAI={() => handleCustomize(occasion)}
          activeStep={step}
        />
      )}

      {step === STEP.AUTH && (
        <AuthPage onSuccess={() => { setHistory([]); setStep(STEP.WEATHER); }} />
      )}

      {step === STEP.WEATHER && (
        <WeatherLanding
          onSelect={handleWeatherSelect}
          onSkip={() => { setWeather(null); go(STEP.EXPLORER); }}
        />
      )}

      {step === STEP.EXPLORER && (
        <OccasionExplorer
          weather={weather}
          onBackToWeather={() => { setHistory([]); setStep(STEP.WEATHER); setWeather(null); }}
          onOccasionClick={handleOccasionSelect}   // NEW prop
        />
      )}

      {step === STEP.OCCASION && (
        <OccasionDetailPage
          occasionId={occasion}
          weather={weather}
          onSelectSub={handleSubOccasionSelect}
          onBack={goBack}
          onCustomize={handleCustomize}
        />
      )}

      {step === STEP.OUTFIT && (
        <OutfitRecommendationPage
          occasionId={occasion}
          subOccasionId={subOccasion?.id}
          subOccasionLabel={subOccasion?.label}
          weather={weather}
          onBack={goBack}
          onPriceCompare={handlePriceCompare}
          onSimilar={() => goBack()}
        />
      )}

      {step === STEP.PRICE && (
        <PriceComparisonPage
          outfit={currentOutfit}
          onBack={goBack}
        />
      )}

      {step === STEP.AI_STYLING && (
        <AIStylingPage
          preOccasion={occasion}
          onBack={goBack}
        />
      )}

      {step === STEP.WARDROBE && (
        <WardrobePage onBack={goBack} />
      )}
    </>
  );
}

// ── Global persistent nav bar ─────────────────────────────────────────────────
function GlobalNav({ user, onLogin, onLogout, onWardrobe, onAI, activeStep }) {
  // Don't show a second nav on pages that have their own built-in nav
  const pagesWithOwnNav = ["occasion","outfit","price","ai_styling","wardrobe"];
  if (pagesWithOwnNav.includes(activeStep)) return null;

  return (
    <div style={{
      position: "fixed", top: "1rem", right: "1.5rem", zIndex: 999,
      display: "flex", alignItems: "center", gap: ".6rem",
    }}>
      <NavPillBtn onClick={onWardrobe}>Wardrobe</NavPillBtn>
      <NavPillBtn onClick={onAI}>AI Style</NavPillBtn>
      {user ? (
        <>
          <span style={{ fontSize: ".72rem", color: "rgba(180,159,212,.6)", letterSpacing: ".08em", fontFamily: "'Outfit',sans-serif" }}>
            {user.name}
          </span>
          <NavPillBtn onClick={onLogout}>Sign out</NavPillBtn>
        </>
      ) : (
        <NavPillBtn onClick={onLogin} highlight>Sign in</NavPillBtn>
      )}
    </div>
  );
}

function NavPillBtn({ children, onClick, highlight }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: highlight ? "rgba(123,104,200,.15)" : "none",
        border: `1px solid ${hovered ? "rgba(180,159,212,.5)" : highlight ? "rgba(123,104,200,.4)" : "rgba(180,159,212,.2)"}`,
        borderRadius: "6px",
        padding: ".3rem .9rem",
        cursor: "pointer",
        fontSize: ".68rem",
        color: highlight ? "rgba(166,150,224,.85)" : "rgba(160,140,190,.6)",
        fontFamily: "'Outfit',sans-serif",
        letterSpacing: ".1em",
        textTransform: "uppercase",
        transition: "all .2s",
      }}
    >
      {children}
    </button>
  );
}

// ── Loading screen ────────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{ minHeight:"100vh", background:"#0D0A14", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.4rem", color:"rgba(180,159,212,.4)", letterSpacing:".06em", animation:"pulse 1.4s ease-in-out infinite" }}>
        dres<em style={{ fontStyle:"italic", color:"#B49FD4" }}>sed</em>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}`}</style>
    </div>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}