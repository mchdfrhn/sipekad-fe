// Shared animation presets so every popup/modal opens and closes the same way.
// Spread them onto motion elements: <motion.div {...modalMotion} />.
// Centering must use Tailwind translate classes (the `translate` CSS property),
// which compose with motion's transform instead of being overwritten.

export const overlayMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2, ease: "easeOut" },
};

export const modalMotion = {
  initial: { opacity: 0, scale: 0.95, y: 16 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 16 },
  transition: { type: "spring", damping: 25, stiffness: 300 },
};
