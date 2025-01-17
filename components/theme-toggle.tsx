"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  // Handle null or undefined `theme` gracefully
  const currentTheme = theme ?? "light";
  const isDarkMode = currentTheme === "dark";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDarkMode ? "light" : "dark")}
            className="w-7 h-7 relative"
          >
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={false}
              animate={{
                rotate: isDarkMode ? 180 : 0,
                opacity: isDarkMode ? 0 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <Sun className="h-[1.1rem] w-[1.1rem]" />
            </motion.div>
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={false}
              animate={{
                rotate: isDarkMode ? 0 : -180,
                opacity: isDarkMode ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <Moon className="h-[1.1rem] w-[1.1rem]" />
            </motion.div>
            <span className="sr-only">Toggle theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Switch to {isDarkMode ? "light" : "dark"} mode
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}