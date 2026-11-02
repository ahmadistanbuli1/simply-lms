import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { getCurrentDbUser } from "@/lib/auth-helper";
import { UserInfo } from "./UserInfo";
import { GuestButtons } from "./GuestButtons";
import type { User } from "../../../generated/prisma/client";
import { Suspense } from "react";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";

// Logo
function NavbarBrand() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 group focus:outline-none"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
        <GraduationCap className="h-5 w-5" />
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-bold tracking-tight text-foreground leading-none">
          Nova<span className="text-primary">Learn</span>
        </span>
        <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase mt-0.5">
          LMS Platform
        </span>
      </div>
    </Link>
  );
}

// Navigation buttons
function NavbarLinks({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <nav className="hidden md:flex items-center gap-1">
      <Link
        href="/"
        className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      >
        <span>Browse</span>
      </Link>

      {isAuthenticated && (
        <>
          <Link
            href="/instructor/courses/create"
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <span>Create Course</span>
          </Link>
        </>
      )}
    </nav>
  );
}

// User information with theme switching
function NavbarActions({ user }: { user: User | null }) {
  return (
    <div className="flex items-center gap-3">
      <AnimatedThemeToggler className="cursor-pointer"/>

      {user ? (
        <UserInfo name={user.name} email={user.email} role={user.role} />
      ) : (
        <GuestButtons />
      )}
    </div>
  );
}

// The component that retrieves user data
async function NavbarUserSection() {
  const user = await getCurrentDbUser();

  return (
    <>
      <NavbarLinks isAuthenticated={Boolean(user)} />
      <NavbarActions user={user} />
    </>
  );
}

// A specific skeleton is being used until user information and data arrive.
function NavbarFallback() {
  return (
    <>
      <div className="hidden md:block" />
      <div className="h-8 w-28 rounded-md bg-muted animate-pulse" />
    </>
  );
}

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <NavbarBrand />
        <Suspense fallback={<NavbarFallback />}>
          <NavbarUserSection />
        </Suspense>
      </div>
    </header>
  );
};

export default Navbar;
