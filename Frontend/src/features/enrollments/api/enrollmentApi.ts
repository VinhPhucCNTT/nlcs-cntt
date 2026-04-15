import { api } from "@/shared/services/api";
import type { ViewCourse } from "@/shared/types/lms";

export const enrollInCourse = async (courseId: string): Promise<void> => {
  await api.post(`/courses/${courseId}/enroll`);
};

export const getMyCourses = async (): Promise<ViewCourse[]> => {
  const { data } = await api.get<ViewCourse[]>("/enrollments/my-courses");
  return data;
};
