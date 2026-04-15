import { api } from "@/shared/services/api";
import type {
  AssessmentResult,
  SubmitAssessmentPayload,
  ViewAssessment,
  ViewQuestion,
} from "@/shared/types/lms";

export const getAssessment = async (id: string): Promise<ViewAssessment> => {
  const { data } = await api.get<ViewAssessment>(`/assessments/${id}`);
  return data;
};

export const getAssessmentQuestions = async (
  id: string,
): Promise<ViewQuestion[]> => {
  const { data } = await api.get<ViewQuestion[]>(
    `/assessments/${id}/questions`,
  );
  return data;
};

export const submitAssessment = async (
  id: string,
  payload: SubmitAssessmentPayload,
): Promise<AssessmentResult> => {
  const { data } = await api.post<AssessmentResult>(
    `/assessments/${id}/submit`,
    payload,
  );
  return data;
};
