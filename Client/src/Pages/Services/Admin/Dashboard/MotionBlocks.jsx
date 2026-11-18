import { motion } from "framer-motion";
import {
  fadeUp,
  motionPropsEarly,
  useAnimationVariants,
} from "../../../../Animations/animations";

/**
 * Reveal: a standalone animated element (or a stagger container).
 * Plays once when it scrolls into view. Respects prefers-reduced-motion
 * through useAnimationVariants (opacity-only, no movement).
 */
export const Reveal = ({ as = "div", variants = fadeUp, ...props }) => {
  const Component = motion[as];
  const resolved = useAnimationVariants(variants);

  return <Component variants={resolved} {...motionPropsEarly} {...props} />;
};

/**
 * Item: a child of a Reveal stagger container. It inherits the
 * hidden/visible state from its parent, so it has no triggers of its own.
 */
export const Item = ({ as = "div", variants = fadeUp, ...props }) => {
  const Component = motion[as];
  const resolved = useAnimationVariants(variants);

  return <Component variants={resolved} {...props} />;
};
