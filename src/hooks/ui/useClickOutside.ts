// useClickOutside.ts
import { useEffect, useRef } from "react";

/**
 * Reusable hook to detect clicks (and touches) outside one or more elements.
 */
export function useClickOutside(
  targets: React.RefObject<HTMLElement> | React.RefObject<HTMLElement>[],
  handler: (event: MouseEvent | TouchEvent) => void
) {
  // keep latest handler in a ref so effect doesn't re-subscribe on every render
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const refsArray = Array.isArray(targets) ? targets : [targets];

    function onEvent(event: MouseEvent | TouchEvent) {
      const targetNode = event.target as Node | null;
      if (!targetNode) return;

      // if click is inside ANY of the target elements → ignore
      const clickedInside = refsArray.some((ref) => {
        const el = ref.current;
        return el && el.contains(targetNode);
      });

      if (clickedInside) return;

      // otherwise call the latest handler
      handlerRef.current(event);
    }

    document.addEventListener("mousedown", onEvent);
    document.addEventListener("touchstart", onEvent);

    return () => {
      document.removeEventListener("mousedown", onEvent);
      document.removeEventListener("touchstart", onEvent);
    };
  }, [targets]);
}
