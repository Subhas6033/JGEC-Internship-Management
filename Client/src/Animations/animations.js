import { useReducedMotion } from "framer-motion";
// Transitions
export const transitions = {
  fast: {
    duration: 0.2,
    ease: [0.4, 0, 0.2, 1],
  },

  normal: {
    duration: 0.4,
    ease: [0.4, 0, 0.2, 1],
  },

  slow: {
    duration: 0.7,
    ease: [0.22, 1, 0.36, 1],
  },

  spring: {
    type: "spring",
    stiffness: 400,
    damping: 30,
  },

  smoothSpring: {
    type: "spring",
    stiffness: 260,
    damping: 24,
  },
};

// Fade In
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

// Fade Up
export const fadeUp = {
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
    y: 12,
    transition: transitions.fast,
  },
};

// Fade Down
export const fadeDown = {
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
    y: -12,
    transition: transitions.fast,
  },
};

// Fade left
export const fadeLeft = {
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
    x: 12,
    transition: transitions.fast,
  },
};

// Fade right
export const fadeRight = {
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
    x: -12,
    transition: transitions.fast,
  },
};

// Scale
export const scaleIn = {
  hidden: {
    opacity: 0,
    scale: 0.94,
  },

  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.smoothSpring,
  },

  exit: {
    opacity: 0,
    scale: 0.96,
    transition: transitions.fast,
  },
};

// POP
export const popIn = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },

  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.spring,
  },

  exit: {
    opacity: 0,
    scale: 0.9,
    transition: transitions.fast,
  },
};

// Slide from up
export const slideUp = {
  hidden: {
    y: "100%",
  },

  visible: {
    y: 0,
    transition: transitions.slow,
  },

  exit: {
    y: "100%",
    transition: transitions.normal,
  },
};

// Slide from right
export const slideRight = {
  hidden: {
    x: "100%",
  },

  visible: {
    x: 0,
    transition: transitions.slow,
  },

  exit: {
    x: "100%",
    transition: transitions.normal,
  },
};

// Stagger Container
export const staggerContainer = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },

  exit: {
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
};

// Stagger Slow
export const staggerSlow = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.1,
    },
  },
};

// Hero Container
export const heroContainer = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export const heroItem = {
  hidden: {
    opacity: 0,
    y: 20,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.slow,
  },
};

// Hover
export const hoverLift = {
  y: -4,
  transition: transitions.fast,
};

export const hoverScale = {
  scale: 1.03,
  transition: transitions.fast,
};

export const hoverScaleSmall = {
  scale: 1.01,
  transition: transitions.fast,
};

// TAP
export const tapScale = {
  scale: 0.97,
};

export const tapScaleSmall = {
  scale: 0.985,
};

// Viewport
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

// Drawer or Menu
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
    y: 12,
  },

  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transitions.smoothSpring,
  },

  exit: {
    opacity: 0,
    scale: 0.97,
    y: 8,
    transition: transitions.fast,
  },
};

// Toast
export const toastAnimation = {
  hidden: {
    opacity: 0,
    x: 40,
    scale: 0.96,
  },

  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: transitions.smoothSpring,
  },

  exit: {
    opacity: 0,
    x: 40,
    scale: 0.96,
    transition: transitions.fast,
  },
};

// Reduces Motions
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
      transition: {
        duration: 0,
      },
    },

    exit: {
      opacity: 0,
      transition: {
        duration: 0,
      },
    },
  };
};

// Common Animations Props
export const motionProps = {
  initial: "hidden",
  whileInView: "visible",
  viewport,
};

const animations = {
  transitions,

  fadeIn,
  fadeUp,
  fadeDown,
  fadeLeft,
  fadeRight,

  scaleIn,
  popIn,

  slideUp,
  slideRight,

  staggerContainer,
  staggerSlow,

  heroContainer,
  heroItem,

  hoverLift,
  hoverScale,
  hoverScaleSmall,

  tapScale,
  tapScaleSmall,

  viewport,
  viewportEarly,
  viewportCenter,

  mobileMenu,

  modalOverlay,
  modalContent,

  toastAnimation,

  motionProps,
};

export default animations;
