"use client";

import { useEffect, useState } from "react";

export function BotaoTema() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("app-theme") as "light" | "dark" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      // Check system preference
      const isLight = window.matchMedia("(prefers-color-scheme: light)").matches;
      const initial = isLight ? "light" : "dark";
      setTheme(initial);
      document.documentElement.setAttribute("data-theme", initial);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("app-theme", newTheme);
  };

  if (!mounted) return <div style={{ width: "132px" }} />; // Placeholder para evitar layout shift

  return (
    <button
      type="button"
      className="btn btn-secondary btn-sm"
      onClick={toggleTheme}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}