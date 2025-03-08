export const transitions = {
  standard: "transition-all duration-200 ease-in-out",
  slow: "transition-all duration-300 ease-in-out",
  fast: "transition-all duration-150 ease-in-out",
  bounce: "transition-all duration-300 ease-bounce",
  spring: "transition-all duration-500 ease-spring",
} as const

export const animations = {
  fadeIn: "animate-in fade-in",
  fadeOut: "animate-out fade-out",
  slideIn: "animate-in slide-in-from-bottom",
  slideOut: "animate-out slide-out-to-bottom",
  scaleIn: "animate-in zoom-in",
  scaleOut: "animate-out zoom-out",
} as const

export const motionSafe = {
  base: "motion-safe:transition-all motion-safe:duration-200",
  reduced: "motion-reduce:transition-none motion-reduce:transform-none",
} as const 