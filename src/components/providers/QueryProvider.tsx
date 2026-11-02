"use client"; // 1. يجب أن يكون Client Component لكي يستخدم Context و State

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

// واجهة الخصائص التي يستقبلها المكون (الأبناء)
interface QueryProviderProps {
  children: React.ReactNode;
}

const QueryProvider = ({ children }: QueryProviderProps) => {
  // 2. إنشاء QueryClient داخل useState لضمان عدم مشاركته بين الطلبات على السيرفر
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // إعدادات افتراضية هامة:
            // لا تقم بإعادة جلب البيانات كلما انتقل المستخدم لتبويبة أخرى وعاد (مزعج ويستهلك موارد)
            refetchOnWindowFocus: false,
            // مدة بقاء البيانات صالحة قبل اعتبارها "قديمة" (Stale) - مثلاً 60 ثانية
            staleTime: 60 * 1000,
            // المحاولة مرة واحدة فقط عند الفشل قبل إظهار الخطأ
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* أداة التطوير لمراقبة الـ Cache (تظهر فقط في بيئة التطوير) */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default QueryProvider;
