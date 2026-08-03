import { useEffect, useRef } from "react";
import abcjs from "abcjs";
import { useABC } from "../context/abcContext";

export function Notation({ onRendered, onError }) {
  const containerRef = useRef(null);
  const { abc } = useABC();

  useEffect(() => {
    if (!containerRef.current) return;
    if (!abc || !abc.trim()) {
      containerRef.current.innerHTML = "";
      return;
    }

    try {
      const tunes = abcjs.renderAbc(containerRef.current, abc, {
        responsive: "resize",
        add_classes: true,
      });
      const tune = tunes?.[0];
      if (!tune || tune.lines?.length === 0) {
        onError?.("Could not parse this as ABC notation.");
        return;
      }
      if (tune.warnings?.length) {
        // abcjs's warning strings embed HTML (<span> highlights) meant for its own
        // inline display; strip tags before we show them as plain text.
        onError?.(
          null,
          tune.warnings.map((w) => w.replace(/<[^>]*>/g, "")),
        );
      } else {
        onError?.(null);
      }
      onRendered?.(tune);
    } catch (err) {
      onError?.(err.message || "Failed to render ABC notation.");
    }
  }, [abc, onRendered, onError]);

  return <div className="notation" ref={containerRef} />;
}
