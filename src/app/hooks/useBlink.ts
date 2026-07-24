import { useEffect, useState } from "react";

export function useBlink() {
  const [isBlink, setIsBlink] = useState(false);

  useEffect(() => {
    let blinkTimer: ReturnType<typeof setTimeout> | null = null;
    let closeTimer: ReturnType<typeof setTimeout> | null = null;

    const schedule = () => {
      const next = 2500 + Math.random() * 3500;

      blinkTimer = setTimeout(() => {
        setIsBlink(true);

        closeTimer = setTimeout(() => {
          setIsBlink(false);
          schedule();
        }, 150);
      }, next);
    };

    schedule();

    return () => {
      if (blinkTimer) clearTimeout(blinkTimer);
      if (closeTimer) clearTimeout(closeTimer);
    };
  }, []);

  return isBlink;
}