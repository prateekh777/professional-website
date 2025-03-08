"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import themeConfig from "@/theme.json"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={themeConfig.appearance}
      enableSystem={themeConfig.appearance === "system"}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
} 