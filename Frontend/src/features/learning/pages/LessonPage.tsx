import { useQuery } from "@tanstack/react-query";
import { Typography, Space, Button } from "antd";
import { useParams } from "react-router-dom";

import { getLesson } from "@/features/learning/api/lessonApi";

const { Title } = Typography;

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: () => getLesson(lessonId!),
    enabled: !!lessonId,
  });

  if (!lessonId) return <p>Missing lesson id.</p>;
  if (isLoading) return <p>Loading lesson…</p>;
  if (error || !data) return <p>Could not load this lesson.</p>;

  return (
    <div>
      <Title level={4}>Lesson</Title>
      <div
        className="lesson-html"
        dangerouslySetInnerHTML={{ __html: data.contentHtml }}
      />
      <Space direction="vertical" style={{ marginTop: 16 }}>
        {data.videoUrl ? (
          <Button href={data.videoUrl} target="_blank" rel="noreferrer">
            Open video
          </Button>
        ) : null}
        {data.attachmentUrl ? (
          <Button href={data.attachmentUrl} target="_blank" rel="noreferrer">
            Download attachment
          </Button>
        ) : null}
      </Space>
    </div>
  );
}
