import { useEffect, useState } from "react";

function resolveInitialTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeToggle({ className = "btn-icon", showLabel = false }) {
  const [theme, setTheme] = useState(resolveInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    window.dispatchEvent(new CustomEvent("hireflow-theme-change", { detail: theme }));
  }, [theme]);

  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      className={className}
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
    >
      <i className={`bi bi-${theme === "dark" ? "sun" : "moon-stars"}`}></i>
      {showLabel && <span className="ms-2">{theme === "dark" ? "Light" : "Dark"}</span>}
    </button>
  );
}
