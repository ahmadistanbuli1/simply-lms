import { redirect } from "next/navigation";
import { getCurrentDbUser } from "@/lib/auth-helper";

interface InstructorLayoutProps {
  children: React.ReactNode;
}

const InstructorLayout = async ({ children }: InstructorLayoutProps) => {
  const user = await getCurrentDbUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (user.role !== "INSTRUCTOR") {
    redirect("/browse");
  }

  return <>{children}</>;
};

export default InstructorLayout;
