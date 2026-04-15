import { api } from "@/shared/services/api";
import type { ViewLesson } from "@/shared/types/lms";

export const getLesson = async (id: string): Promise<ViewLesson> => {
  const { data } = await api.get<ViewLesson>(`/lessons/${id}`);
  return data;
};
