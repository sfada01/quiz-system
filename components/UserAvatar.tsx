"use client";

interface Props {
  avatar: string;
  name: string;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
}

const sizes = {
  sm: "h-8 w-8 text-base",
  md: "h-11 w-11 text-xl",
  lg: "h-16 w-16 text-3xl",
};

export default function UserAvatar({ avatar, name, size = "md", showName = false }: Props) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex shrink-0 items-center justify-center rounded-full
                    border border-white/10 bg-surface-3 ${sizes[size]}`}
        aria-label={name}
        title={name}
      >
        {avatar}
      </div>
      {showName && <span className="text-sm font-medium text-ink">{name}</span>}
    </div>
  );
}