"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const hasDark = document.documentElement.classList.contains("dark");
      setIsDark(hasDark);
    } catch (error) {
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    try {
      const nextIsDark = !document.documentElement.classList.contains("dark");
      if (nextIsDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      setIsDark(nextIsDark);
    } catch (error) {}
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {isDark ? (
        // Sun icon for light mode
        <Moon />
      ) : (
        // Moon icon for dark mode
        <Sun />
      )}
    </Button>
  );
}
