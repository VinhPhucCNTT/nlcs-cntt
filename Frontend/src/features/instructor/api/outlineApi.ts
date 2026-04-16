import { api } from "@/shared/services/api";
import type {
  CreateActivityPayload,
  CreateAssessmentPayload,
  CreateAssessmentQuestionPayload,
  CreateAssignmentPayload,
  CreateLessonPayload,
  CreateModulePayload,
  UpdateActivityPayload,
  UpdateAssessmentPayload,
  UpdateAssessmentQuestionPayload,
  UpdateAssignmentPayload,
  UpdateLessonPayload,
  ViewAssessment,
  ViewAssignment,
  ViewActivity,
  ViewLesson,
  ViewQuestion,
  ViewModule,
} from "@/shared/types/lms";

export const createModule = async (
  courseId: string,
  payload: CreateModulePayload,
): Promise<string> => {
  const { data } = await api.put<string>(
    `/courses/${courseId}/modules`,
    payload,
  );
  return data;
};

export const getModules = async (courseId: string): Promise<ViewModule[]> => {
  const { data } = await api.get<ViewModule[]>(
    `/courses/${courseId}/modules`,
  );
  return data;
};

export const updateModule = async (
  id: string,
  payload: CreateModulePayload,
): Promise<void> => {
  await api.post(`/modules/${id}`, payload);
};

export const deleteModule = async (id: string): Promise<void> => {
  await api.delete(`/modules/${id}`);
};

export const createActivity = async (
  moduleId: string,
  payload: CreateActivityPayload,
): Promise<string> => {
  const { data } = await api.put<string>(
    `/modules/${moduleId}/activities`,
    payload,
  );
  return data;
};

export const getActivities = async (
  moduleId: string,
): Promise<ViewActivity[]> => {
  const { data } = await api.get<ViewActivity[]>(
    `/modules/${moduleId}/activities`,
  );
  return data;
};

export const updateActivity = async (
  id: string,
  payload: UpdateActivityPayload,
): Promise<void> => {
  await api.post(`/activities/${id}`, payload);
};

export const deleteActivity = async (id: string): Promise<void> => {
  await api.delete(`/activities/${id}`);
};

export const createLesson = async (
  activityId: string,
  payload: CreateLessonPayload,
): Promise<string> => {
  const { data } = await api.put<string>(
    `/activities/${activityId}/lessons`,
    payload,
  );
  return data;
};

export const getLesson = async (id: string): Promise<ViewLesson> => {
  const { data } = await api.get<ViewLesson>(`/lessons/${id}`);
  return data;
};

export const updateLesson = async (
  id: string,
  payload: UpdateLessonPayload,
): Promise<void> => {
  await api.post(`/lessons/${id}`, payload);
};

export const createAssignment = async (
  activityId: string,
  payload: CreateAssignmentPayload,
): Promise<string> => {
  const { data } = await api.put<string>(
    `/activities/${activityId}/assignments`,
    payload,
  );
  return data;
};

export const getAssignment = async (id: string): Promise<ViewAssignment> => {
  const { data } = await api.get<ViewAssignment>(`/assignments/${id}`);
  return data;
};

export const updateAssignment = async (
  id: string,
  payload: UpdateAssignmentPayload,
): Promise<void> => {
  await api.post(`/assignments/${id}`, payload);
};

export const createAssessment = async (
  activityId: string,
  payload: CreateAssessmentPayload,
): Promise<string> => {
  const { data } = await api.post<string>(
    `/activities/${activityId}/assessments`,
    payload,
  );
  return data;
};

export const getAssessment = async (id: string): Promise<ViewAssessment> => {
  const { data } = await api.get<ViewAssessment>(`/assessments/${id}`);
  return data;
};

export const updateAssessment = async (
  id: string,
  payload: UpdateAssessmentPayload,
): Promise<void> => {
  await api.post(`/assessments/${id}`, payload);
};

export const getAssessmentQuestions = async (
  id: string,
): Promise<ViewQuestion[]> => {
  const { data } = await api.get<ViewQuestion[]>(`/assessments/${id}/questions`);
  return data;
};

export const addAssessmentQuestion = async (
  assessmentId: string,
  payload: CreateAssessmentQuestionPayload,
): Promise<string> => {
  const { data } = await api.post<string>(
    `/assessments/${assessmentId}/questions`,
    payload,
  );
  return data;
};

export const updateAssessmentQuestion = async (
  id: string,
  payload: UpdateAssessmentQuestionPayload,
): Promise<void> => {
  await api.post(`/questions/${id}`, payload);
};

export const deleteAssessmentQuestion = async (
  id: string,
): Promise<void> => {
  await api.delete(`/questions/${id}`);
};
