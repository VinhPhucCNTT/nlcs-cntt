import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Switch,
  Typography,
  message,
  Divider,
} from "antd";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";

import ModuleActivitiesTable from "@/features/instructor/components/ModuleActivitiesTable";
import {
  addAssessmentQuestion,
  createActivity,
  createAssessment,
  createAssignment,
  createLesson,
  createModule,
  deleteModule,
  getModules,
} from "@/features/instructor/api/outlineApi";
import {
  ActivityType,
  AssessmentType,
  QuestionType,
  type CreateAssessmentPayload,
  type CreateAssignmentPayload,
  type CreateLessonPayload,
} from "@/shared/types/lms";

const { Title, Text } = Typography;

export default function CourseBuilderPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const queryClient = useQueryClient();
  const [msg, ctx] = message.useMessage();

  const [moduleOpen, setModuleOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState<string | null>(null);
  const [lessonOpen, setLessonOpen] = useState<{
    activityId: string;
  } | null>(null);
  const [assignOpen, setAssignOpen] = useState<{
    activityId: string;
  } | null>(null);
  const [assessOpen, setAssessOpen] = useState<{
    activityId: string;
  } | null>(null);
  const [questionOpen, setQuestionOpen] = useState<{
    assessmentId: string;
  } | null>(null);

  const [moduleForm] = Form.useForm<{ title: string; orderIndex: number }>();
  const [activityForm] = Form.useForm<{
    title: string;
    type: ActivityType;
    orderIndex: number;
    isPublished: boolean;
  }>();
  const [lessonForm] = Form.useForm<CreateLessonPayload>();
  const [assignForm] = Form.useForm<CreateAssignmentPayload>();
  const [assessForm] = Form.useForm<
    Omit<CreateAssessmentPayload, "type"> & { type: AssessmentType }
  >();
  const [qForm] = Form.useForm<{
    questionText: string;
    type: (typeof QuestionType)[keyof typeof QuestionType];
    points: number;
    orderIndex: number;
    options: { optionText: string; isCorrect: boolean }[];
  }>();

  const modulesQuery = useQuery({
    queryKey: ["course", courseId, "modules"],
    queryFn: () => getModules(courseId!),
    enabled: !!courseId,
  });

  const createModuleMut = useMutation({
    mutationFn: (v: { title: string; orderIndex: number }) =>
      createModule(courseId!, v),
    onSuccess: () => {
      msg.success("Module created.");
      setModuleOpen(false);
      void queryClient.invalidateQueries({ queryKey: ["course", courseId, "modules"] });
    },
    onError: () => msg.error("Failed to create module."),
  });

  const deleteModuleMut = useMutation({
    mutationFn: deleteModule,
    onSuccess: () => {
      msg.success("Module removed.");
      void queryClient.invalidateQueries({ queryKey: ["course", courseId, "modules"] });
    },
    onError: () => msg.error("Failed."),
  });

  if (!courseId) return <Text type="danger">Missing course id.</Text>;

  return (
    <div>
      {ctx}
      <Title level={3}>Course builder</Title>
      <Text type="secondary">Course id: {courseId}</Text>
      <div style={{ marginTop: 8 }}>
        <Link to={`/courses/${courseId}`}>← Course overview</Link>
      </div>

      <div style={{ marginTop: 16 }}>
        <Button type="primary" onClick={() => setModuleOpen(true)}>
          Add module
        </Button>
      </div>

      <Divider />

      {(modulesQuery.data ?? []).map((mod) => (
        <div key={mod.id} style={{ marginBottom: 32 }}>
          <Space style={{ marginBottom: 8 }}>
            <Title level={4} style={{ margin: 0 }}>
              {mod.title}
            </Title>
            <Button size="small" onClick={() => setActivityOpen(mod.id)}>
              Add activity
            </Button>
            <Button
              size="small"
              danger
              onClick={() => {
                Modal.confirm({
                  title: "Delete this module?",
                  onOk: () => deleteModuleMut.mutate(mod.id),
                });
              }}
            >
              Delete module
            </Button>
          </Space>
          <ModuleActivitiesTable
            moduleId={mod.id}
            courseId={courseId}
            onAddLesson={(id) => setLessonOpen({ activityId: id })}
            onAddAssignment={(id) => setAssignOpen({ activityId: id })}
            onAddAssessment={(id) => setAssessOpen({ activityId: id })}
            onAddQuestion={(assessmentId) => setQuestionOpen({ assessmentId })}
          />
        </div>
      ))}

      <Modal
        title="New module"
        open={moduleOpen}
        onCancel={() => setModuleOpen(false)}
        onOk={() => moduleForm.submit()}
        destroyOnClose
      >
        <Form
          form={moduleForm}
          layout="vertical"
          onFinish={(v) => createModuleMut.mutate(v)}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="orderIndex"
            label="Order"
            rules={[{ required: true }]}
            initialValue={0}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="New activity"
        open={!!activityOpen}
        onCancel={() => setActivityOpen(null)}
        onOk={() => activityForm.submit()}
        destroyOnClose
      >
        <Form
          form={activityForm}
          layout="vertical"
          initialValues={{ isPublished: true, orderIndex: 0, type: ActivityType.Lesson }}
          onFinish={async (v) => {
            if (!activityOpen) return;
            const moduleId = activityOpen;
            await createActivity(moduleId, {
              title: v.title,
              type: v.type,
              orderIndex: v.orderIndex,
              isPublished: v.isPublished,
              availableFrom: null,
              availableUntil: null,
            });
            msg.success("Activity created.");
            activityForm.resetFields();
            setActivityOpen(null);
            void queryClient.invalidateQueries({
              queryKey: ["module", moduleId, "activities"],
            });
          }}
        >
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select
              options={[
                { value: ActivityType.Lesson, label: "Lesson" },
                { value: ActivityType.Assignment, label: "Assignment" },
                { value: ActivityType.Assessment, label: "Assessment" },
              ]}
            />
          </Form.Item>
          <Form.Item name="orderIndex" label="Order" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="isPublished" label="Published" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Lesson content"
        open={!!lessonOpen}
        onCancel={() => setLessonOpen(null)}
        onOk={() => lessonForm.submit()}
        width={640}
        destroyOnClose
      >
        <Form
          form={lessonForm}
          layout="vertical"
          onFinish={async (v) => {
            if (!lessonOpen) return;
            await createLesson(lessonOpen.activityId, v);
            msg.success("Lesson saved.");
            setLessonOpen(null);
            void queryClient.invalidateQueries({ queryKey: ["module"] });
            void queryClient.invalidateQueries({
              queryKey: ["course", courseId, "content"],
            });
          }}
        >
          <Form.Item
            name="contentHtml"
            label="Content (HTML)"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={10} />
          </Form.Item>
          <Form.Item name="videoUrl" label="Video URL">
            <Input />
          </Form.Item>
          <Form.Item name="attachmentUrl" label="Attachment URL">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Assignment details"
        open={!!assignOpen}
        onCancel={() => setAssignOpen(null)}
        onOk={() => assignForm.submit()}
        destroyOnClose
      >
        <Form
          form={assignForm}
          layout="vertical"
          initialValues={{
            allowLateSubmission: true,
            maxPoints: 100,
            instructions: "",
          }}
          onFinish={async (v) => {
            if (!assignOpen) return;
            await createAssignment(assignOpen.activityId, v);
            msg.success("Assignment created.");
            setAssignOpen(null);
            void queryClient.invalidateQueries({ queryKey: ["module"] });
            void queryClient.invalidateQueries({
              queryKey: ["course", courseId, "content"],
            });
          }}
        >
          <Form.Item
            name="instructions"
            label="Instructions"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={5} />
          </Form.Item>
          <Form.Item name="dueDate" label="Due date (ISO)">
            <Input placeholder="optional" />
          </Form.Item>
          <Form.Item
            name="allowLateSubmission"
            label="Allow late submission"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item name="maxPoints" label="Max points" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Assessment (exam) settings"
        open={!!assessOpen}
        onCancel={() => setAssessOpen(null)}
        onOk={() => assessForm.submit()}
        destroyOnClose
      >
        <Form
          form={assessForm}
          layout="vertical"
          initialValues={{
            timeLimitMinutes: 30,
            maxAttempts: 3,
            passingScore: 50,
            shuffleQuestions: false,
            type: AssessmentType.Quiz,
          }}
          onFinish={async (v) => {
            if (!assessOpen) return;
            const payload: CreateAssessmentPayload = {
              type: v.type,
              timeLimitMinutes: v.timeLimitMinutes,
              maxAttempts: v.maxAttempts,
              password: v.password || undefined,
              passingScore: v.passingScore,
              shuffleQuestions: v.shuffleQuestions,
            };
            await createAssessment(assessOpen.activityId, payload);
            msg.success("Assessment created. Add questions next.");
            setAssessOpen(null);
            void queryClient.invalidateQueries({ queryKey: ["module"] });
            void queryClient.invalidateQueries({
              queryKey: ["course", courseId, "content"],
            });
          }}
        >
          <Form.Item name="type" label="Assessment type">
            <Select
              options={[
                { value: AssessmentType.Quiz, label: "Quiz" },
                { value: AssessmentType.Exam, label: "Exam" },
              ]}
            />
          </Form.Item>
          <Form.Item name="timeLimitMinutes" label="Time limit (minutes)">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="maxAttempts" label="Max attempts">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="passingScore" label="Passing score">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="shuffleQuestions"
            label="Shuffle questions"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item name="password" label="Password (optional)">
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Add exam question"
        open={!!questionOpen}
        onCancel={() => setQuestionOpen(null)}
        onOk={() => qForm.submit()}
        width={560}
        destroyOnClose
      >
        <Form
          form={qForm}
          layout="vertical"
          initialValues={{
            type: QuestionType.SingleChoice,
            points: 1,
            orderIndex: 0,
            options: [
              { optionText: "", isCorrect: true },
              { optionText: "", isCorrect: false },
            ],
          }}
          onFinish={async (v) => {
            if (!questionOpen) return;
            await addAssessmentQuestion(questionOpen.assessmentId, {
              questionText: v.questionText,
              type: v.type,
              points: v.points,
              orderIndex: v.orderIndex,
              options: v.options.filter((o) => o.optionText.trim().length > 0),
            });
            msg.success("Question added.");
            setQuestionOpen(null);
            void queryClient.invalidateQueries({ queryKey: ["module"] });
          }}
        >
          <Form.Item
            name="questionText"
            label="Question"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="type" label="Question type">
            <Select
              options={[
                {
                  value: QuestionType.SingleChoice,
                  label: "Single choice",
                },
                {
                  value: QuestionType.MultipleChoice,
                  label: "Multiple choice",
                },
              ]}
            />
          </Form.Item>
          <Form.Item name="points" label="Points">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="orderIndex" label="Order">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.List name="options">
            {(fields, { add, remove }) => (
              <div>
                {fields.map((field) => (
                  <Space key={field.key} align="baseline">
                    <Form.Item {...field} name={[field.name, "optionText"]} label="Option">
                      <Input />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, "isCorrect"]}
                      valuePropName="checked"
                    >
                      <Switch checkedChildren="Correct" unCheckedChildren="Wrong" />
                    </Form.Item>
                    <Button type="link" danger onClick={() => remove(field.name)}>
                      Remove
                    </Button>
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add({ optionText: "", isCorrect: false })}>
                  Add option
                </Button>
              </div>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
}
