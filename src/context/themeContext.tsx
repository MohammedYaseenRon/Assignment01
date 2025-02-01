"use client";
import React, { useState, createContext, ReactNode, useEffect } from "react";


type Theme = "light" | "dark" | "sci-fic" | "retro" | "minimal" | "neon";

interface ThemeContextType {
    theme: Theme;
    changeTheme: (theme: Theme) => void
}


export const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<Theme>("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as Theme;
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    const changeTheme = (newTheme: Theme) => {
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    }

    return (
        <ThemeContext.Provider value={{ theme, changeTheme }}>
            <div className={theme}>{children}</div>
        </ThemeContext.Provider>
    )
}