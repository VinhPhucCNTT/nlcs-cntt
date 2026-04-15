import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Typography,
  Card,
  Radio,
  Checkbox,
  Space,
  Button,
  Form,
  message,
} from "antd";
import { useParams } from "react-router-dom";
import { useMemo, useState } from "react";

import { useAuthContext } from "@/features/auth/context/useAuthContext";
import { getPrimaryRole } from "@/shared/helpers/role";
import {
  getAssessment,
  getAssessmentQuestions,
  submitAssessment,
} from "@/features/learning/api/assessmentApi";
import { AssessmentType, QuestionType } from "@/shared/types/lms";

const { Title, Text } = Typography;

export default function AssessmentPage() {
  const { user } = useAuthContext();
  const role = getPrimaryRole(user?.roles);
  const isStudent = role === "Student";
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(
    null,
  );

  const metaQuery = useQuery({
    queryKey: ["assessment", assessmentId],
    queryFn: () => getAssessment(assessmentId!),
    enabled: !!assessmentId,
  });

  const questionsQuery = useQuery({
    queryKey: ["assessment", assessmentId, "questions"],
    queryFn: () => getAssessmentQuestions(assessmentId!),
    enabled: !!assessmentId && isStudent,
  });

  const questions = useMemo(
    () => questionsQuery.data ?? [],
    [questionsQuery.data],
  );

  const submitMut = useMutation({
    mutationFn: (answers: { questionId: string; answerText: string[] }[]) =>
      submitAssessment(assessmentId!, { answers }),
    onSuccess: (res) => {
      setResult(res);
      message.success("Submitted.");
    },
    onError: () => message.error("Could not submit assessment."),
  });

  const onFinish = (values: Record<string, string | string[]>) => {
    const answers = questions.map((q) => {
      const key = `q_${q.id}`;
      const raw = values[key];
      const answerText = Array.isArray(raw)
        ? raw
        : raw
          ? [raw as string]
          : [];
      return { questionId: q.id, answerText };
    });
    submitMut.mutate(answers);
  };

  if (!assessmentId) return <p>Missing assessment id.</p>;
  if (metaQuery.isLoading) return <p>Loading…</p>;
  if (metaQuery.error || !metaQuery.data)
    return <p>Could not load assessment.</p>;

  const meta = metaQuery.data;

  if (!isStudent) {
    return (
      <div>
        <Title level={4}>
          {meta.type === AssessmentType.Quiz ? "Quiz" : "Exam"}
        </Title>
        <Text type="secondary">
          Passing score: {meta.passingScore}, Time limit (min): {meta.timeLimitMinutes}
        </Text>
        <p style={{ marginTop: 12 }}>
          Switch to a student account to take this assessment.
        </p>
      </div>
    );
  }

  if (questionsQuery.isLoading) return <p>Loading questions…</p>;
  if (questionsQuery.error)
    return <Text type="danger">Could not load questions.</Text>;

  if (result) {
    return (
      <Card>
        <Title level={4}>Result</Title>
        <p>Score: {result.score}</p>
        <p>{result.passed ? "Passed" : "Not passed"}</p>
      </Card>
    );
  }

  return (
    <div>
      <Title level={4}>Assessment</Title>
      <Text type="secondary">
        Passing score: {meta.passingScore} · Time limit: {meta.timeLimitMinutes}{" "}
        min · Max attempts: {meta.maxAttempts}
      </Text>

      <Form layout="vertical" style={{ marginTop: 24 }} onFinish={onFinish}>
        {questions.map((q) => (
          <Card key={q.id} size="small" style={{ marginBottom: 16 }}>
            <Text strong>{q.questionText}</Text>
            <div style={{ marginTop: 8 }}>
              {q.type === QuestionType.SingleChoice ? (
                <Form.Item
                  name={`q_${q.id}`}
                  rules={[{ required: true, message: "Select an option." }]}
                >
                  <Radio.Group>
                    <Space direction="vertical">
                      {q.options.map((o) => (
                        <Radio key={o.id} value={o.optionText}>
                          {o.optionText}
                        </Radio>
                      ))}
                    </Space>
                  </Radio.Group>
                </Form.Item>
              ) : (
                <Form.Item
                  name={`q_${q.id}`}
                  rules={[{ required: true, message: "Select at least one option." }]}
                >
                  <Checkbox.Group>
                    <Space direction="vertical">
                      {q.options.map((o) => (
                        <Checkbox key={o.id} value={o.optionText}>
                          {o.optionText}
                        </Checkbox>
                      ))}
                    </Space>
                  </Checkbox.Group>
                </Form.Item>
              )}
            </div>
          </Card>
        ))}
        <Button type="primary" htmlType="submit" loading={submitMut.isPending}>
          Submit answers
        </Button>
      </Form>
    </div>
  );
}
