import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReorderChaptersInput } from "../validations/course.schema";
import { courseService } from "../services/course.service";
import { getErrorMessage } from "@/lib/get-error-message";
import { toast } from "sonner";

export function useReorderChapters(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, unknown, ReorderChaptersInput>({
    mutationFn: (payload) => courseService.reorderChapters(courseId, payload),
    onSuccess: () => {
      toast.success("Chapters order saved");
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
      // If this fails, we retrieve the original order from the server to correct the incorrect order in the interface.
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
    },
  });
}
