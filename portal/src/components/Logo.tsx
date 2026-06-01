import Link from "next/link";

type Props = {
  href?: string;
  size?: "sm" | "md" | "lg";
  suffix?: string; // small text after the wordmark, e.g. "Teachers" or "Portal"
  className?: string;
};

const SIZES = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-3xl",
} as const;

export default function Logo({
  href = "/",
  size = "md",
  suffix,
  className = "",
}: Props) {
  const inner = (
    <span
      className={`${SIZES[size]} font-black tracking-tight flex items-center gap-2 ${className}`}
    >
      <span className="flex items-center">
        <span className="text-[#193b92]">Tech</span>
        <span className="text-[#2C7A7B]">Bash</span>
      </span>
      {suffix && (
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 border-l border-slate-200 pl-2">
          {suffix}
        </span>
      )}
    </span>
  );

  if (!href) return inner;
  return (
    <Link href={href} aria-label="TechBash home" className="inline-flex">
      {inner}
    </Link>
  );
}
