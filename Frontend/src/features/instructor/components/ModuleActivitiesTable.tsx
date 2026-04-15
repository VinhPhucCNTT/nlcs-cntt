import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Space, Table } from "antd";

import {
  deleteActivity,
  getActivities,
} from "@/features/instructor/api/outlineApi";
import { ActivityType } from "@/shared/types/lms";

interface Props {
  moduleId: string;
  courseId: string;
  onAddLesson: (activityId: string) => void;
  onAddAssignment: (activityId: string) => void;
  onAddAssessment: (activityId: string) => void;
  onAddQuestion: (assessmentId: string) => void;
}

export default function ModuleActivitiesTable({
  moduleId,
  courseId,
  onAddLesson,
  onAddAssignment,
  onAddAssessment,
  onAddQuestion,
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
              {row.type === ActivityType.Assessment && row.resourceId && (
                <Button
                  size="small"
                  onClick={() => onAddQuestion(row.resourceId!)}
                >
                  Add question
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
