import { api } from "@/shared/services/api";
import type {
  SubmitAssignmentPayload,
  ViewAssignment,
} from "@/shared/types/lms";

export const getAssignment = async (id: string): Promise<ViewAssignment> => {
  const { data } = await api.get<ViewAssignment>(`/assignments/${id}`);
  return data;
};

export const submitAssignment = async (
  id: string,
  payload: SubmitAssignmentPayload,
): Promise<void> => {
  await api.post(`/assignments/${id}/submit`, payload);
};
