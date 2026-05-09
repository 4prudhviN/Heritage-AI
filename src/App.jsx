import { useState } from "react";
import Home from "./Home";
import HeritageAI from "./HeritageAI";

export default function App() {
  const [screen, setScreen] = useState("home"); // home, chat, analyze
  const [language, setLanguage] = useState("en-US");

  if (screen === "home") {
    return <Home onStart={setScreen} language={language} setLanguage={setLanguage} />;
  }

  return (
    <HeritageAI
      mode={screen}
      onBack={() => setScreen("home")}
      language={language}
      setLanguage={setLanguage}
    />
  );
}
