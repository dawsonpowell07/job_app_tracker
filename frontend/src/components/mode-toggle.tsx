import { Moon, Sun } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  const themes = ["light", "dark", "system"];
  const [currentThemeIndex, setCurrentThemeIndex] = React.useState(
    themes.indexOf(theme || "system"),
  );

  React.useEffect(() => {
    setCurrentThemeIndex(themes.indexOf(theme || "system"));
  }, [theme]);

  const toggleTheme = () => {
    const nextThemeIndex = (currentThemeIndex + 1) % themes.length;
    setTheme(themes[nextThemeIndex] as "light" | "dark" | "system");
    setCurrentThemeIndex(nextThemeIndex);
  };

  const getThemeIcon = () => {
    switch (themes[currentThemeIndex]) {
      case "light":
        return <Sun className="h-[1.2rem] w-[1.2rem]" />;
      case "dark":
        return <Moon className="h-[1.2rem] w-[1.2rem]" />;
      case "system":
      default:
        return (
          <>
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          </>
        );
    }
  };

  return (
    <Button
      variant="ghost"
      className="w-full justify-center gap-2"
      onClick={toggleTheme}
    >
      {getThemeIcon()}
      <span className="group-data-[collapsible=icon]:hidden">
        {themes[currentThemeIndex].charAt(0).toUpperCase() +
          themes[currentThemeIndex].slice(1)}
      </span>
    </Button>
  );
}
