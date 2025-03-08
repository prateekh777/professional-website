import themeConfig from "@/theme.json"

export function getThemeConfig() {
  return {
    primary: themeConfig.primary,
    variant: themeConfig.variant as "professional" | "tint" | "vibrant",
    appearance: themeConfig.appearance as "light" | "dark" | "system",
    radius: themeConfig.radius,
    colors: themeConfig.colors
  }
}

export function getCssVariableValue(variableName: string) {
  if (typeof window !== "undefined") {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim()
    return value
  }
  return ""
} 