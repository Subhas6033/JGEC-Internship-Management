import { useCallback, useState } from "react";

let toastSequence = 0;

const useToasts = () => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback((toast) => {
    toastSequence += 1;
    setToasts((current) => [...current, { id: toastSequence, ...toast }]);
  }, []);

  return { toasts, notify, dismiss };
};

export default useToasts;
