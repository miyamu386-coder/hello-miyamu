import { useEffect, useRef, useState } from "react";

export function useAddedToast(duration = 1800) {
  const [justAdded, setJustAdded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showAddedToast = () => {
    setJustAdded(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setJustAdded(false);
    }, duration);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    justAdded,
    showAddedToast,
  };
}