import {useState, useEffect} from "react";

export function useImeStatus() {
  const [isImeActive, setIsImeActive] = useState(false);

  useEffect(() => {
    const handleCompositionStart = () => {
      setIsImeActive(true);
    };

    const handleCompositionEnd = () => {
      setIsImeActive(false);
    };

    document.addEventListener("compositionstart", handleCompositionStart);
    document.addEventListener("compositionend", handleCompositionEnd);

    return () => {
      document.removeEventListener("compositionstart", handleCompositionStart);
      document.removeEventListener("compositionend", handleCompositionEnd);
    };
  }, []);

  return isImeActive;
}
