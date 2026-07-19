"use client";

import React, { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

export default function AnimatedCounter({
  value,
  duration = 2.5, // Slow, elegant animation
  decimals = 0,
  prefix = "",
  suffix = "",
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  // Trigger animation when the counter comes into view
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let startTimestamp = null;
    const endValue = Number(value);
    const startValue = 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      
      // Cubic ease-out curve for a smooth deceleration towards the target
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      const currentCount = startValue + easeProgress * (endValue - startValue);
      setCount(currentCount);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(endValue);
      }
    };

    window.requestAnimationFrame(step);
  }, [isInView, value, duration]);

  // Format the number with the specified decimals
  const formattedValue = count.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
}
