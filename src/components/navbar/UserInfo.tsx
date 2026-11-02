import { UserButton } from "@clerk/nextjs";
import type { Role } from "../../../generated/prisma/client";
import { ShieldCheck, GraduationCap, BookOpen } from "lucide-react";

interface UserInfoProps {
  name: string | null;
  email: string;
  role: Role;
}

// Configuration Map: To define the colors and icons of each role without using nested if/else.
const ROLE_BADGE_CONFIG: Record<
  Role,
  { label: string; className: string; icon: React.ReactNode }
> = {
  ADMIN: {
    label: "Admin",
    className: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    icon: <ShieldCheck className="w-3.5 h-3.5" />,
  },
  INSTRUCTOR: {
    label: "Instructor",
    className:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    icon: <BookOpen className="w-3.5 h-3.5" />,
  },
  STUDENT: {
    label: "Student",
    className:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    icon: <GraduationCap className="w-3.5 h-3.5" />,
  },
};

export function UserInfo({ name, email, role }: UserInfoProps) {
  const badge = ROLE_BADGE_CONFIG[role];
  const displayName = name || email.split("@")[0];

  return (
    <div className="flex items-center gap-3 pl-2 border-l border-border">
      <span
        className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.className}`}
      >
        {badge.icon}
        {badge.label}
      </span>

      {/* الاسم والبريد */}
      <div className="hidden md:flex flex-col items-end text-right leading-tight">
        <span className="text-sm font-semibold text-foreground truncate max-w-35">
          {displayName}
        </span>
        <span className="text-xs text-muted-foreground truncate max-w-35">
          {email}
        </span>
      </div>

      <UserButton />
    </div>
  );
}
