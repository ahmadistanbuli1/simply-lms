import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Code2,
  Trophy,
} from "lucide-react";

const PLATFORM_FEATURES = [
  {
    icon: <BookOpen className="w-5 h-5 text-primary" />,
    title: "Structured Chapters & Lessons",
    description:
      "Organize courses into sequential chapters with rich video and attachment support.",
  },
  {
    icon: <Trophy className="w-5 h-5 text-primary" />,
    title: "Interactive Quizzes & Auto-Grading",
    description:
      "Test student knowledge after every lesson with instant score calculation.",
  },
  {
    icon: <CheckCircle2 className="w-5 h-5 text-primary" />,
    title: "Real-Time Progress Tracking",
    description:
      "Students resume exactly where they left off with accurate completion metrics.",
  },
];

const HomePage = () => {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background text-foreground flex flex-col justify-between">
      <section className="relative overflow-hidden py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
            Master New Skills with{" "}
            <span className="text-primary underline decoration-primary/30 decoration-wavy underline-offset-8">
              Structured
            </span>{" "}
            Interactive Courses
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
            An end-to-end learning platform built for instructors to craft
            curriculum, upload resources, and design quizzes—while empowering
            students to track every step of their engineering journey.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button asChild size="lg" className="gap-2 shadow-md">
              <Link href="/instructor/courses/create">
                <span>Start Creating a Course</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link href="/sign-in">
                <Code2 className="w-4 h-4" />
                <span>Explore Platform</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLATFORM_FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl border border-border bg-card text-card-foreground shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
