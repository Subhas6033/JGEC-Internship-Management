import { useReducedMotion } from "framer-motion";

// Transitions
export const transitions = {
  instant: {
    duration: 0,
  },

  fast: {
    duration: 0.2,
    ease: [0.4, 0, 0.2, 1],
  },

  normal: {
    duration: 0.35,
    ease: [0.4, 0, 0.2, 1],
  },

  smooth: {
    duration: 0.45,
    ease: [0.22, 1, 0.36, 1],
  },

  slow: {
    duration: 0.6,
    ease: [0.22, 1, 0.36, 1],
  },

  spring: {
    type: "spring",
    stiffness: 400,
    damping: 30,
    mass: 0.8,
  },

  smoothSpring: {
    type: "spring",
    stiffness: 260,
    damping: 24,
    mass: 0.8,
  },

  gentleSpring: {
    type: "spring",
    stiffness: 180,
    damping: 22,
    mass: 0.9,
  },
};

// Page Animations
export const pageEnter = {
  hidden: {
    opacity: 0,
    y: 16,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.slow,
  },

  exit: {
    opacity: 0,
    y: 8,
    transition: transitions.fast,
  },
};

export const pageFade = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,
    transition: transitions.normal,
  },

  exit: {
    opacity: 0,
    transition: transitions.fast,
  },
};

// Fade Animations
export const fadeIn = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,
    transition: transitions.normal,
  },

  exit: {
    opacity: 0,
    transition: transitions.fast,
  },
};

export const fadeUp = {
  hidden: {
    opacity: 0,
    y: 20,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.slow,
  },

  exit: {
    opacity: 0,
    y: 10,
    transition: transitions.fast,
  },
};

export const fadeDown = {
  hidden: {
    opacity: 0,
    y: -20,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.slow,
  },

  exit: {
    opacity: 0,
    y: -10,
    transition: transitions.fast,
  },
};

export const fadeLeft = {
  hidden: {
    opacity: 0,
    x: 20,
  },

  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.slow,
  },

  exit: {
    opacity: 0,
    x: 10,
    transition: transitions.fast,
  },
};

export const fadeRight = {
  hidden: {
    opacity: 0,
    x: -20,
  },

  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.slow,
  },

  exit: {
    opacity: 0,
    x: -10,
    transition: transitions.fast,
  },
};

// Scale Animations
export const scaleIn = {
  hidden: {
    opacity: 0,
    scale: 0.96,
  },

  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.smoothSpring,
  },

  exit: {
    opacity: 0,
    scale: 0.98,
    transition: transitions.fast,
  },
};

export const popIn = {
  hidden: {
    opacity: 0,
    scale: 0.85,
  },

  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.spring,
  },

  exit: {
    opacity: 0,
    scale: 0.92,
    transition: transitions.fast,
  },
};

// Login / Regiter Animations
export const introAnimation = {
  hidden: {
    opacity: 0,
    x: -16,
  },

  visible: {
    opacity: 1,
    x: 0,
    transition: {
      ...transitions.slow,
      delay: 0.05,
    },
  },

  exit: {
    opacity: 0,
    x: -8,
    transition: transitions.fast,
  },
};

export const cardAnimation = {
  hidden: {
    opacity: 0,
    y: 18,
    scale: 0.985,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ...transitions.slow,
      delay: 0.08,
    },
  },

  exit: {
    opacity: 0,
    y: 10,
    transition: transitions.fast,
  },
};

export const sectionAnimation = {
  hidden: {
    opacity: 0,
    y: 10,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.normal,
  },

  exit: {
    opacity: 0,
    y: 6,
    transition: transitions.fast,
  },
};

export const formItemAnimation = {
  hidden: {
    opacity: 0,
    y: 8,
  },

  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      ...transitions.normal,
      delay: index * 0.045,
    },
  }),

  exit: {
    opacity: 0,
    y: -4,
    transition: transitions.fast,
  },
};

// Step Transitions
export const stepAnimation = {
  initial: (direction = 1) => ({
    opacity: 0,
    x: direction > 0 ? 18 : -18,
  }),

  animate: {
    opacity: 1,
    x: 0,
    transition: transitions.normal,
  },

  exit: (direction = 1) => ({
    opacity: 0,
    x: direction > 0 ? -18 : 18,
    transition: transitions.fast,
  }),
};

// Stagger Containers
export const staggerContainer = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.04,
    },
  },

  exit: {
    transition: {
      staggerChildren: 0.035,
      staggerDirection: -1,
    },
  },
};

export const staggerSlow = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },

  exit: {
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
};

export const staggerFast = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.02,
    },
  },
};

// Hero
export const heroContainer = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
    },
  },
};

export const heroItem = {
  hidden: {
    opacity: 0,
    y: 18,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.slow,
  },
};

// Slide Animations

/*
 * Keep these distances finite.
 *
 * Avoid:
 *   x: "100%"
 *
 * because an off-screen transformed element can contribute to horizontal
 * overflow in some layouts.
 */

export const slideUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.slow,
  },

  exit: {
    opacity: 0,
    y: 16,
    transition: transitions.normal,
  },
};

export const slideDown = {
  hidden: {
    opacity: 0,
    y: -24,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.slow,
  },

  exit: {
    opacity: 0,
    y: -16,
    transition: transitions.normal,
  },
};

export const slideLeft = {
  hidden: {
    opacity: 0,
    x: 24,
  },

  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.slow,
  },

  exit: {
    opacity: 0,
    x: -16,
    transition: transitions.normal,
  },
};

export const slideRight = {
  hidden: {
    opacity: 0,
    x: -24,
  },

  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.slow,
  },

  exit: {
    opacity: 0,
    x: 16,
    transition: transitions.normal,
  },
};

// Hover or  TAP
export const hoverLift = {
  y: -4,
  transition: transitions.fast,
};

export const hoverLiftSmall = {
  y: -2,
  transition: transitions.fast,
};

export const hoverScale = {
  scale: 1.03,
  transition: transitions.fast,
};

export const hoverScaleSmall = {
  scale: 1.015,
  transition: transitions.fast,
};

export const tapScale = {
  scale: 0.97,
};

export const tapScaleSmall = {
  scale: 0.985,
};

// Icon or Micro Transitions
export const iconPop = {
  initial: {
    opacity: 0,
    scale: 0.75,
  },

  animate: {
    opacity: 1,
    scale: 1,
    transition: transitions.spring,
  },

  exit: {
    opacity: 0,
    scale: 0.75,
    transition: transitions.fast,
  },
};

export const iconRotate = {
  initial: {
    opacity: 0,
    rotate: -20,
    scale: 0.9,
  },

  animate: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: transitions.spring,
  },

  exit: {
    opacity: 0,
    rotate: 20,
    scale: 0.9,
    transition: transitions.fast,
  },
};

// Check Success
export const checkAnimation = {
  initial: {
    opacity: 0,
    scale: 0,
    rotate: -30,
  },

  animate: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: transitions.spring,
  },

  exit: {
    opacity: 0,
    scale: 0.7,
    transition: transitions.fast,
  },
};

// Progress
export const progressAnimation = {
  initial: {
    scaleX: 0,
  },

  animate: {
    scaleX: 1,
    transition: transitions.smooth,
  },
};

// Mobile Menu
export const mobileMenu = {
  hidden: {
    opacity: 0,
    height: 0,
  },

  visible: {
    opacity: 1,
    height: "auto",
    transition: transitions.normal,
  },

  exit: {
    opacity: 0,
    height: 0,
    transition: transitions.fast,
  },
};

// Modal
export const modalOverlay = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,
    transition: transitions.fast,
  },

  exit: {
    opacity: 0,
    transition: transitions.fast,
  },
};

export const modalContent = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 10,
  },

  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transitions.smoothSpring,
  },

  exit: {
    opacity: 0,
    scale: 0.98,
    y: 6,
    transition: transitions.fast,
  },
};

// Toast
export const toastAnimation = {
  hidden: {
    opacity: 0,
    x: 24,
    scale: 0.97,
  },

  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: transitions.smoothSpring,
  },

  exit: {
    opacity: 0,
    x: 24,
    scale: 0.97,
    transition: transitions.fast,
  },
};

// Reduced Motions
export const useAnimationVariants = (variants) => {
  const shouldReduceMotion = useReducedMotion();

  if (!shouldReduceMotion) {
    return variants;
  }

  return {
    hidden: {
      opacity: 0,
    },

    visible: {
      opacity: 1,
      transition: transitions.instant,
    },

    animate: {
      opacity: 1,
      transition: transitions.instant,
    },

    exit: {
      opacity: 0,
      transition: transitions.instant,
    },

    initial: {
      opacity: 0,
    },
  };
};

// Common Viewport animations
export const viewport = {
  once: true,
  amount: 0.2,
};

export const viewportEarly = {
  once: true,
  amount: 0.1,
};

export const viewportCenter = {
  once: true,
  amount: 0.5,
};

// Common motion props
export const motionProps = {
  initial: "hidden",
  whileInView: "visible",
  viewport,
};

export const motionPropsEarly = {
  initial: "hidden",
  whileInView: "visible",
  viewport: viewportEarly,
};

export const motionPropsCenter = {
  initial: "hidden",
  whileInView: "visible",
  viewport: viewportCenter,
};

// Page Animations
export const pageAnimation = {
  hidden: {
    opacity: 0,
    y: 10,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...transitions.normal,
      ease: [0.22, 1, 0.36, 1],
    },
  },

  exit: {
    opacity: 0,
    y: 6,
    transition: transitions.fast,
  },
};

const animations = {
  transitions,

  pageEnter,
  pageFade,
  pageAnimation,

  fadeIn,
  fadeUp,
  fadeDown,
  fadeLeft,
  fadeRight,

  scaleIn,
  popIn,

  introAnimation,
  cardAnimation,
  sectionAnimation,
  formItemAnimation,

  stepAnimation,

  staggerContainer,
  staggerSlow,
  staggerFast,

  heroContainer,
  heroItem,

  slideUp,
  slideDown,
  slideLeft,
  slideRight,

  hoverLift,
  hoverLiftSmall,
  hoverScale,
  hoverScaleSmall,

  tapScale,
  tapScaleSmall,

  iconPop,
  iconRotate,
  checkAnimation,
  progressAnimation,

  mobileMenu,

  modalOverlay,
  modalContent,

  toastAnimation,

  useAnimationVariants,

  viewport,
  viewportEarly,
  viewportCenter,

  motionProps,
  motionPropsEarly,
  motionPropsCenter,
};

export default animations;
