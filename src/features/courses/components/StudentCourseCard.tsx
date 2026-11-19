"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen, User as UserIcon, Heart, ArrowRight } from "lucide-react";
import { StudentCourseCardItem } from "../interfaces/course.interface";

interface StudentCourseCardProps {
  course: StudentCourseCardItem;
}

export const StudentCourseCard = ({ course }: StudentCourseCardProps) => {
  const chaptersCount = course._count.chapters;
  const instructorName = course.instructor.name || "Course Instructor";

  const handleLoveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Loved course:", course.id);
  };

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/40">
      <button
        onClick={handleLoveClick}
        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background/70 border border-border/50 backdrop-blur-md text-muted-foreground shadow-sm transition-all duration-300 hover:bg-red-50 hover:text-red-500 hover:border-red-200 hover:scale-110 active:scale-95"
        aria-label="Add to favorites"
      >
        <Heart className="h-4.5 w-4.5" />
      </button>

      <Link href={`/courses/${course.id}`} className="flex flex-1 flex-col">
        <div className="relative w-full aspect-video overflow-hidden bg-muted/40">
          {course.imageUrl ? (
            <Image
              src={course.imageUrl}
              alt={course.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground/50">
              <BookOpen className="h-12 w-12" strokeWidth={1.5} />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-lg font-bold text-foreground leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {course.title}
          </h3>

          <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {course.description || "No description provided for this course."}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-medium text-muted-foreground">
            <div className="flex items-center gap-1.5 rounded-md bg-muted/50 px-2.5 py-1.5">
              <UserIcon className="h-3.5 w-3.5 text-primary/80" />
              <span className="truncate max-w-30">{instructorName}</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-md bg-muted/50 px-2.5 py-1.5">
              <BookOpen className="h-3.5 w-3.5 text-primary/80" />
              <span>
                {chaptersCount} {chaptersCount === 1 ? "Chapter" : "Chapters"}
              </span>
            </div>
          </div>

          <div className="mt-auto pt-5">
            <div className="flex w-full items-center justify-between rounded-xl border border-border/40 bg-muted/20 p-3 transition-colors group-hover:bg-primary/5 group-hover:border-primary/20">
              <span className="text-sm font-semibold text-foreground/80 group-hover:text-primary transition-colors">
                Start Learning
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:translate-x-1">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
