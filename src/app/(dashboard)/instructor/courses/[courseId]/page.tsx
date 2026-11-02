// "use client";

// import { Suspense, use } from "react";
// import { useGetCourse } from "@/features/courses/hooks/useGetCourse";
// import { CourseDescriptionForm } from "@/features/courses/components/CourseDescriptionForm";

// interface PageProps {
//   params: Promise<{ courseId: string }>;
// }

// // 1. مكون داخلي مسؤول عن فك الـ Promise وجلب وعرض بيانات الدورة
// const CourseSetupContent = ({ params }: PageProps) => {
//   const { courseId } = use(params);
//   const { data: course, isLoading, isError } = useGetCourse(courseId);

//   if (isLoading) {
//     return (
//       <div className="p-6 flex items-center justify-center min-h-100">
//         <p className="text-sm text-slate-500 animate-pulse">
//           Loading course details...
//         </p>
//       </div>
//     );
//   }

//   if (isError || !course) {
//     return (
//       <div className="p-6 flex items-center justify-center min-h-[400px]">
//         <p className="text-sm text-red-500 font-medium">
//           Failed to load course or access denied.
//         </p>
//       </div>
//     );
//   }

//   const requiredFields = [course.title, course.description, course.imageUrl];

//   const totalFields = requiredFields.length;
//   const completedFields = requiredFields.filter(Boolean).length;
//   const completionText = `(${completedFields}/${totalFields})`;

//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       <div className="flex items-center justify-between">
//         <div className="flex flex-col gap-y-2">
//           <h1 className="text-2xl font-semibold text-slate-900">
//             Course Setup: {course.title}
//           </h1>
//           <span className="text-sm text-slate-600">
//             Complete all fields to publish your course {completionText}
//           </span>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
//         <div>
//           <h2 className="text-xl font-medium text-slate-800">
//             Customize your course
//           </h2>

//           <CourseDescriptionForm
//             initialData={{ description: course.description }}
//             courseId={course.id}
//           />
//         </div>

//         <div>
//           <h2 className="text-xl font-medium text-slate-800">
//             Course chapters
//           </h2>
//           <div className="mt-6 border bg-slate-100 rounded-md p-4 text-sm text-slate-500">
//             Chapters management will be implemented here next.
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // 2. المكون الجذري للصفحة يحوط المحتوى بـ Suspense لمنع خطأ Prerendering في Next.js
// const CourseSetupPage = async ({ params }: PageProps) => {
//   const { courseId } = await params;
//   return <CourseSetupContent params={} />;
// };

// export default CourseSetupPage;

import { CourseSetupContent } from "@/features/courses/components/CourseSetupContent";

interface PageProps {
  params: Promise<{ courseId: string }>;
}

const CourseSetupPage = async ({ params }: PageProps) => {
  const { courseId } = await params;
  return <CourseSetupContent courseId={courseId} />;
};

export default CourseSetupPage;
