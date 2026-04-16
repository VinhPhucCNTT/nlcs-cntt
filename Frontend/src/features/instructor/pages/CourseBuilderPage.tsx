import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  List,
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
  deleteAssessmentQuestion,
  createModule,
  getAssessment,
  getAssessmentQuestions,
  getAssignment,
  getLesson,
  deleteModule,
  getModules,
  updateActivity,
  updateAssessment,
  updateAssessmentQuestion,
  updateAssignment,
  updateLesson,
} from "@/features/instructor/api/outlineApi";
import {
  ActivityType,
  AssessmentType,
  QuestionType,
  type ViewActivity,
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
  const [activityOpen, setActivityOpen] = useState<{
    moduleId: string;
    activity?: ViewActivity;
  } | null>(null);
  const [lessonOpen, setLessonOpen] = useState<{
    activityId: string;
    lessonId?: string;
  } | null>(null);
  const [assignOpen, setAssignOpen] = useState<{
    activityId: string;
    assignmentId?: string;
  } | null>(null);
  const [assessOpen, setAssessOpen] = useState<{
    activityId: string;
    assessmentId?: string;
  } | null>(null);
  const [questionOpen, setQuestionOpen] = useState<{
    assessmentId: string;
    questionId?: string;
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

  const questionsQuery = useQuery({
    queryKey: ["assessment", questionOpen?.assessmentId, "questions"],
    queryFn: () => getAssessmentQuestions(questionOpen!.assessmentId),
    enabled: !!questionOpen?.assessmentId,
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

  const openCreateActivity = (moduleId: string) => {
    activityForm.resetFields();
    activityForm.setFieldsValue({
      title: "",
      type: ActivityType.Lesson,
      orderIndex: 0,
      isPublished: true,
    });
    setActivityOpen({ moduleId });
  };

  const openEditActivity = (moduleId: string, activity: ViewActivity) => {
    activityForm.resetFields();
    activityForm.setFieldsValue({
      title: activity.title,
      type: activity.type,
      orderIndex: activity.orderIndex,
      isPublished: activity.isPublished,
    });
    setActivityOpen({ moduleId, activity });
  };

  const openCreateLesson = (activityId: string) => {
    lessonForm.resetFields();
    setLessonOpen({ activityId });
  };

  const openEditLesson = async (activityId: string, lessonId: string) => {
    const lesson = await getLesson(lessonId);
    lessonForm.resetFields();
    lessonForm.setFieldsValue({
      contentHtml: lesson.contentHtml,
      videoUrl: lesson.videoUrl ?? undefined,
      attachmentUrl: lesson.attachmentUrl ?? undefined,
    });
    setLessonOpen({ activityId, lessonId });
  };

  const openCreateAssignment = (activityId: string) => {
    assignForm.resetFields();
    assignForm.setFieldsValue({
      allowLateSubmission: true,
      maxPoints: 100,
      instructions: "",
      dueDate: undefined,
    });
    setAssignOpen({ activityId });
  };

  const openEditAssignment = async (activityId: string, assignmentId: string) => {
    const assignment = await getAssignment(assignmentId);
    assignForm.resetFields();
    assignForm.setFieldsValue({
      instructions: assignment.instructions,
      dueDate: assignment.dueDate ?? undefined,
      allowLateSubmission: assignment.allowLateSubmission,
      maxPoints: assignment.maxPoints,
    });
    setAssignOpen({ activityId, assignmentId });
  };

  const openCreateAssessment = (activityId: string) => {
    assessForm.resetFields();
    assessForm.setFieldsValue({
      timeLimitMinutes: 30,
      maxAttempts: 3,
      passingScore: 50,
      shuffleQuestions: false,
      type: AssessmentType.Quiz,
    });
    setAssessOpen({ activityId });
  };

  const openEditAssessment = async (activityId: string, assessmentId: string) => {
    const assessment = await getAssessment(assessmentId);
    assessForm.resetFields();
    assessForm.setFieldsValue({
      type: assessment.type,
      timeLimitMinutes: assessment.timeLimitMinutes,
      maxAttempts: assessment.maxAttempts,
      passingScore: assessment.passingScore,
      shuffleQuestions: assessment.shuffleQuestions,
      password: "",
    });
    setAssessOpen({ activityId, assessmentId });
  };

  const openManageQuestions = (assessmentId: string) => {
    qForm.resetFields();
    qForm.setFieldsValue({
      type: QuestionType.SingleChoice,
      points: 1,
      orderIndex: 0,
      options: [
        { optionText: "", isCorrect: true },
        { optionText: "", isCorrect: false },
      ],
    });
    setQuestionOpen({ assessmentId });
  };

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
            <Button size="small" onClick={() => openCreateActivity(mod.id)}>
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
            onAddLesson={openCreateLesson}
            onAddAssignment={openCreateAssignment}
            onAddAssessment={openCreateAssessment}
            onManageQuestions={openManageQuestions}
            onEditActivity={(activity) => openEditActivity(mod.id, activity)}
            onEditLesson={openEditLesson}
            onEditAssignment={openEditAssignment}
            onEditAssessment={openEditAssessment}
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
        title={activityOpen?.activity ? "Edit activity" : "New activity"}
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
            const moduleId = activityOpen.moduleId;
            if (activityOpen.activity) {
              await updateActivity(activityOpen.activity.id, {
                title: v.title,
                type: v.type,
                orderIndex: v.orderIndex,
                isPublished: v.isPublished,
                availableFrom: activityOpen.activity.availableFrom,
                availableUntil: activityOpen.activity.availableUntil,
              });
              msg.success("Activity updated.");
            } else {
              await createActivity(moduleId, {
                title: v.title,
                type: v.type,
                orderIndex: v.orderIndex,
                isPublished: v.isPublished,
                availableFrom: null,
                availableUntil: null,
              });
              msg.success("Activity created.");
            }
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
              disabled={!!activityOpen?.activity}
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
        title={lessonOpen?.lessonId ? "Edit lesson content" : "Lesson content"}
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
            if (lessonOpen.lessonId) {
              await updateLesson(lessonOpen.lessonId, v);
              msg.success("Lesson updated.");
            } else {
              await createLesson(lessonOpen.activityId, v);
              msg.success("Lesson created.");
            }
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
        title={assignOpen?.assignmentId ? "Edit assignment details" : "Assignment details"}
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
            if (assignOpen.assignmentId) {
              await updateAssignment(assignOpen.assignmentId, v);
              msg.success("Assignment updated.");
            } else {
              await createAssignment(assignOpen.activityId, v);
              msg.success("Assignment created.");
            }
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
        title={assessOpen?.assessmentId ? "Edit assessment settings" : "Assessment (exam) settings"}
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
            if (assessOpen.assessmentId) {
              await updateAssessment(assessOpen.assessmentId, payload);
              msg.success("Assessment updated.");
            } else {
              await createAssessment(assessOpen.activityId, payload);
              msg.success("Assessment created. Add questions next.");
            }
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
        title={
          questionOpen?.questionId
            ? "Edit exam question"
            : "Manage exam questions"
        }
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
            const payload = {
              questionText: v.questionText,
              type: v.type,
              points: v.points,
              orderIndex: v.orderIndex,
              options: v.options.filter((o) => o.optionText.trim().length > 0),
            };
            if (questionOpen.questionId) {
              await updateAssessmentQuestion(questionOpen.questionId, payload);
              msg.success("Question updated.");
            } else {
              await addAssessmentQuestion(questionOpen.assessmentId, payload);
              msg.success("Question added.");
            }
            qForm.resetFields();
            setQuestionOpen({ assessmentId: questionOpen.assessmentId });
            void queryClient.invalidateQueries({
              queryKey: ["assessment", questionOpen.assessmentId, "questions"],
            });
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
        <Divider />
        <List
          size="small"
          loading={questionsQuery.isLoading}
          dataSource={questionsQuery.data ?? []}
          renderItem={(question) => (
            <List.Item
              actions={[
                <Button
                  key="edit"
                  size="small"
                  onClick={() => {
                    qForm.setFieldsValue({
                      questionText: question.questionText,
                      type: question.type,
                      points: question.points,
                      orderIndex: question.orderIndex,
                      options: question.options.map((o) => ({
                        optionText: o.optionText,
                        isCorrect: o.isCorrect,
                      })),
                    });
                    setQuestionOpen({
                      assessmentId: questionOpen!.assessmentId,
                      questionId: question.id,
                    });
                  }}
                >
                  Edit
                </Button>,
                <Button
                  key="delete"
                  size="small"
                  danger
                  onClick={async () => {
                    await deleteAssessmentQuestion(question.id);
                    msg.success("Question removed.");
                    if (questionOpen?.questionId === question.id) {
                      qForm.resetFields();
                      setQuestionOpen({ assessmentId: questionOpen.assessmentId });
                    }
                    void queryClient.invalidateQueries({
                      queryKey: ["assessment", questionOpen?.assessmentId, "questions"],
                    });
                  }}
                >
                  Delete
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={question.questionText}
                description={`Points: ${question.points} | Options: ${question.options.length}`}
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
}
