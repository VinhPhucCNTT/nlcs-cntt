import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Typography, Form, Input, Button, message, Card } from "antd";
import { useParams } from "react-router-dom";

import { useAuthContext } from "@/features/auth/context/useAuthContext";
import { getPrimaryRole } from "@/shared/helpers/role";
import {
  getAssignment,
  submitAssignment,
} from "@/features/learning/api/assignmentApi";

const { Title, Text } = Typography;

export default function AssignmentPage() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const { user } = useAuthContext();
  const role = getPrimaryRole(user?.roles);
  const isStudent = role === "Student";
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["assignment", assignmentId],
    queryFn: () => getAssignment(assignmentId!),
    enabled: !!assignmentId,
  });

  const submitMut = useMutation({
    mutationFn: (vals: { submissionText: string; fileUrl?: string }) =>
      submitAssignment(assignmentId!, vals),
    onSuccess: () => {
      message.success("Submission sent.");
      void queryClient.invalidateQueries({ queryKey: ["assignment", assignmentId] });
    },
    onError: () => message.error("Submission failed."),
  });

  if (!assignmentId) return <p>Missing assignment id.</p>;
  if (isLoading) return <p>Loading…</p>;
  if (error || !data) return <p>Could not load assignment.</p>;

  return (
    <div>
      <Title level={4}>Assignment</Title>
      <Card size="small" style={{ marginBottom: 16 }}>
        <div style={{ whiteSpace: "pre-wrap" }}>{data.instructions}</div>
        <Text type="secondary">
          Max points: {data.maxPoints}
          {data.dueDate ? ` — Due: ${new Date(data.dueDate).toLocaleString()}` : ""}
        </Text>
      </Card>

      {isStudent ? (
        <Form
          layout="vertical"
          onFinish={(v) =>
            submitMut.mutate({
              submissionText: v.submissionText,
              fileUrl: v.fileUrl || undefined,
            })
          }
        >
          <Form.Item
            name="submissionText"
            label="Your answer"
            rules={[{ required: true, message: "Enter your submission." }]}
          >
            <Input.TextArea rows={8} />
          </Form.Item>
          <Form.Item name="fileUrl" label="Attachment URL (optional)">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitMut.isPending}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <Text type="secondary">
          Students submit answers here. Open this page as a student account to try a
          submission.
        </Text>
      )}
    </div>
  );
}
