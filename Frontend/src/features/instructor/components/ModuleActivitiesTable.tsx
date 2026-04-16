import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Space, Table } from "antd";

import {
  deleteActivity,
  getActivities,
} from "@/features/instructor/api/outlineApi";
import { ActivityType, type ViewActivity } from "@/shared/types/lms";

interface Props {
  moduleId: string;
  courseId: string;
  onAddLesson: (activityId: string) => void;
  onAddAssignment: (activityId: string) => void;
  onAddAssessment: (activityId: string) => void;
  onManageQuestions: (assessmentId: string) => void;
  onEditActivity: (activity: ViewActivity) => void;
  onEditLesson: (activityId: string, lessonId: string) => void;
  onEditAssignment: (activityId: string, assignmentId: string) => void;
  onEditAssessment: (activityId: string, assessmentId: string) => void;
}

export default function ModuleActivitiesTable({
  moduleId,
  courseId,
  onAddLesson,
  onAddAssignment,
  onAddAssessment,
  onManageQuestions,
  onEditActivity,
  onEditLesson,
  onEditAssignment,
  onEditAssessment,
}: Props) {
  const queryClient = useQueryClient();

  const aq = useQuery({
    queryKey: ["module", moduleId, "activities"],
    queryFn: () => getActivities(moduleId),
  });

  const removeAct = useMutation({
    mutationFn: deleteActivity,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["module", moduleId, "activities"] });
      void queryClient.invalidateQueries({
        queryKey: ["course", courseId, "content"],
      });
    },
  });

  return (
    <Table
      size="small"
      loading={aq.isLoading}
      rowKey="id"
      dataSource={aq.data ?? []}
      pagination={false}
      columns={[
        { title: "Title", dataIndex: "title" },
        {
          title: "Type",
          dataIndex: "type",
          width: 110,
          render: (t: ActivityType) =>
            t === ActivityType.Lesson
              ? "Lesson"
              : t === ActivityType.Assessment
                ? "Exam"
                : "Assignment",
        },
        {
          title: "Linked",
          dataIndex: "resourceId",
          render: (rid: string | null) => (rid ? "Yes" : "No"),
        },
        {
          title: "",
          key: "a",
          render: (_, row) => (
            <Space wrap>
              {!row.resourceId && row.type === ActivityType.Lesson && (
                <Button size="small" onClick={() => onAddLesson(row.id)}>
                  Add lesson
                </Button>
              )}
              {!row.resourceId && row.type === ActivityType.Assignment && (
                <Button size="small" onClick={() => onAddAssignment(row.id)}>
                  Add assignment
                </Button>
              )}
              {!row.resourceId && row.type === ActivityType.Assessment && (
                <Button size="small" onClick={() => onAddAssessment(row.id)}>
                  Add exam shell
                </Button>
              )}
              <Button size="small" onClick={() => onEditActivity(row)}>
                Edit activity
              </Button>
              {row.type === ActivityType.Lesson && row.resourceId && (
                <Button
                  size="small"
                  onClick={() => onEditLesson(row.id, row.resourceId!)}
                >
                  Edit lesson
                </Button>
              )}
              {row.type === ActivityType.Assignment && row.resourceId && (
                <Button
                  size="small"
                  onClick={() => onEditAssignment(row.id, row.resourceId!)}
                >
                  Edit assignment
                </Button>
              )}
              {row.type === ActivityType.Assessment && row.resourceId && (
                <Button
                  size="small"
                  onClick={() => onEditAssessment(row.id, row.resourceId!)}
                >
                  Edit assessment
                </Button>
              )}
              {row.type === ActivityType.Assessment && row.resourceId && (
                <Button
                  size="small"
                  onClick={() => onManageQuestions(row.resourceId!)}
                >
                  Manage questions
                </Button>
              )}
              <Button
                size="small"
                danger
                onClick={() => removeAct.mutate(row.id)}
              >
                Remove
              </Button>
            </Space>
          ),
        },
      ]}
    />
  );
}
