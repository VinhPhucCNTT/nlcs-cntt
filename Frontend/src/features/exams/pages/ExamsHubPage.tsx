import { useQueries, useQuery } from "@tanstack/react-query";
import { List, Typography } from "antd";
import { Link } from "react-router-dom";

import { getCourseContent } from "@/features/courses/api/courseApi";
import { getMyCourses } from "@/features/enrollments/api/enrollmentApi";
import { useAuthContext } from "@/features/auth/context/useAuthContext";
import { getPrimaryRole } from "@/shared/helpers/role";
import { ActivityType } from "@/shared/types/lms";

const { Title, Text } = Typography;

export default function ExamsHubPage() {
  const { user } = useAuthContext();
  const role = getPrimaryRole(user?.roles);

  const my = useQuery({
    queryKey: ["enrollments", "my"],
    queryFn: getMyCourses,
    enabled: role === "Student",
  });

  const contents = useQueries({
    queries: (my.data ?? []).map((c) => ({
      queryKey: ["course", c.id, "content"],
      queryFn: () => getCourseContent(c.id),
      enabled: role === "Student" && !!my.data?.length,
    })),
  });

  if (role !== "Student") {
    return (
      <div>
        <Title level={3}>Exams</Title>
        <Text type="secondary">
          Exam list is for students. Instructors configure assessments in the course
          builder.
        </Text>
      </div>
    );
  }

  const items: { key: string; title: string; courseId: string; assessmentId: string }[] =
    [];

  (my.data ?? []).forEach((course, idx) => {
    const content = contents[idx]?.data;
    if (!content) return;
    for (const mod of content.modules) {
      for (const a of mod.activities ?? []) {
        if (a.type === ActivityType.Assessment && a.resourceId) {
          items.push({
            key: `${course.id}-${a.id}`,
            title: `${course.title} · ${a.title}`,
            courseId: course.id,
            assessmentId: a.resourceId,
          });
        }
      }
    }
  });

  return (
    <div>
      <Title level={3}>My exams</Title>
      <List
        loading={my.isLoading || contents.some((c) => c.isLoading)}
        dataSource={items}
        locale={{ emptyText: "No exams in your enrolled courses." }}
        renderItem={(item) => (
          <List.Item>
            <Link
              to={`/courses/${item.courseId}/assessment/${item.assessmentId}`}
            >
              {item.title}
            </Link>
          </List.Item>
        )}
      />
    </div>
  );
}
