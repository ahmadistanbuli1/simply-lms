import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import { cache } from "react";

export const getCurrentDbUser = cache(async () => {
  const { userId: clerkId } = await auth();

  if (!clerkId) return null;

  return await prisma.user.findUnique({
    where: { clerkId: clerkId },
  });
});
