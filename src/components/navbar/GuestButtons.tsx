import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";

export const GuestButtons = () => {
  return (
    <div className="flex items-center gap-2.5">
      <Button asChild variant="ghost" size="sm" className="font-medium">
        <Link href="/sign-in" className="flex items-center gap-1.5">
          <LogIn className="w-4 h-4" />
          <span>Sign In</span>
        </Link>
      </Button>

      <Button asChild size="sm" className="font-medium shadow-sm">
        <Link href="/sign-up" className="flex items-center gap-1.5">
          <UserPlus className="w-4 h-4" />
          <span>Sign Up</span>
        </Link>
      </Button>
    </div>
  );
};

export default GuestButtons;
