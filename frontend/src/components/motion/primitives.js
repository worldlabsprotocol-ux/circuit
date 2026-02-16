/**
 * WL Studio Motion Primitives
 *
 * These are declarative motion definitions.
 * They do NOTHING by themselves.
 *
 * MotionGate or any animation engine
 * may optionally consume these.
 */

// Global timing rules
export const timing = {
  fast: 0.12,
  base: 0.22,
  slow: 0.36,
}

// Easing (deliberately restrained)
export const easing = {
  linear: 'linear',
  out: 'ease-out',
  inOut: 'ease-in-out',
}

// Panel-level motion (Jupiter-style)
export const panelFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: {
    duration: timing.base,
    ease: easing.out,
  },
}

// Subtle vertical reveal (Zora-style)
export const panelReveal = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: timing.base,
    ease: easing.out,
  },
}

// Step activation (Hyperliquid restraint)
export const stepActivate = {
  initial: { opacity: 0.4 },
  animate: { opacity: 1 },
  transition: {
    duration: timing.fast,
    ease: easing.linear,
  },
}

// Sweep motion timing (used for current step)
export const sweep = {
  transition: {
    duration: timing.fast,
    ease: easing.linear,
  },
}
