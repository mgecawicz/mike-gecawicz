import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";
import { observeReveal } from "../hooks/reveal";

type Props = {
  children: ReactNode;
  /** stagger delay in ms */
  delay?: number;
  /** "up" (default) | "left" | "right" | "fade" */
  from?: "up" | "left" | "right" | "fade";
  as?: "div" | "section" | "li" | "span" | "figure";
  className?: string;
};

export function Reveal({
  children,
  delay = 0,
  from = "up",
  as: Tag = "div",
  className = "",
}: Props) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => observeReveal(ref.current), []);
  const style: CSSProperties | undefined = delay
    ? { transitionDelay: `${delay}ms` }
    : undefined;
  return (
    <Tag
      ref={ref as never}
      className={`reveal reveal-${from} ${className}`.trim()}
      style={style}
    >
      {children}
    </Tag>
  );
}
