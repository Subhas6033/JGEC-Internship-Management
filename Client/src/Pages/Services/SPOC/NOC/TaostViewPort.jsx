import { useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Toast } from "../../../../Components/index";

const ToastItem = ({ toast, onDismiss }) => {
  const { id, ...toastProps } = toast;
  const handleClose = useCallback(() => onDismiss(id), [id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.2 }}
    >
      <Toast {...toastProps} onClose={handleClose} />
    </motion.div>
  );
};

const ToastViewport = ({ toasts, onDismiss }) => (
  <div className="pointer-events-none fixed inset-x-0 bottom-4 z-110 flex flex-col items-end gap-2 px-4 sm:left-auto sm:right-4 sm:w-full sm:max-w-sm">
    <AnimatePresence initial={false}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </AnimatePresence>
  </div>
);

export default ToastViewport;
