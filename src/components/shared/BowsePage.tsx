"use client";

import { Compass, Sparkles, BookOpenCheck } from "lucide-react";
import { useGetPublishedCourses } from "@/features/courses/hooks/useGetPublishedCourses";
import { StudentCourseCard } from "@/features/courses/components/StudentCourseCard";

const StudentBrowsePage = () => {
  const { data: courses, isLoading, isError } = useGetPublishedCourses();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* القسم الترحيبي للطالب (Student Header Banner) */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Student Learning Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Explore Published Courses
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Pick a structured course below, watch video chapters, and build
            real-world software engineering skills step by step.
          </p>
        </div>
      </div>

      {/* حالة التحميل */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-80 rounded-2xl border border-border bg-muted/30 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* حالة الخطأ */}
      {isError && (
        <div className="p-6 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-sm font-medium text-center">
          Failed to load available courses. Please refresh the page.
        </div>
      )}

      {/* حالة عدم وجود دورات منشورة بعد */}
      {!isLoading && !isError && courses?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-border bg-muted/10">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
            <Compass className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-foreground">
            No published courses yet
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mt-1">
            Instructors are currently preparing their curriculum. Check back
            soon for new courses!
          </p>
        </div>
      )}

      {/* شبكة عرض الدورات المنشورة */}
      {!isLoading && !isError && courses && courses.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <BookOpenCheck className="h-4 w-4 text-primary" />
              <span>Available Courses ({courses.length})</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <StudentCourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentBrowsePage;
