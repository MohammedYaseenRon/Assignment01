"use client";

import { ThemeContext } from "@/context/themeContext";
import React, { useContext } from "react";

const themes = ["light", "dark", "sci-fic", "retro", "minimal", "neon"] as const;


export default function ThemeSelector() {
    const themeContext = useContext(ThemeContext);

    if (!themeContext) return null;
    const { theme, changeTheme } = themeContext;

    return (
        <div className="flex gap-3 p-4">
            {themes.map((t) => (
                <button key={t} className={`p-2 rounded-lg ${theme === t ? "bg-blue-500 text-white" : "bg-gray-200"}`} onClick={() => changeTheme(t)}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
            ))}
        </div>
    )
}