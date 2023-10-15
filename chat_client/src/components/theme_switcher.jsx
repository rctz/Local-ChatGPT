import React from "react";

function ThemeSwitcher({ onThemeChange }) {
  return (
    <div className="theme-switcher">
      <div className="theme-buttons">
        <button onClick={() => onThemeChange("light")}>&#9728;</button>
        <button onClick={() => onThemeChange("dark")}>&#9790;</button>
      </div>
    </div>
  );
}

export default ThemeSwitcher;
