import { useScramble } from "../hooks/useScramble";

type Props = {
  text: string;
  href: string;
  className?: string;
  external?: boolean;
};

export function ScrambleLink({ text, href, className = "", external }: Props) {
  const { display, scramble } = useScramble(text);
  return (
    <a
      className={`scramble-link ${className}`.trim()}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      onMouseEnter={scramble}
      onFocus={scramble}
      data-cursor="link"
    >
      {display}
    </a>
  );
}
