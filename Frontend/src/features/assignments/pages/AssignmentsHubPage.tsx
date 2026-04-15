import { useQueries, useQuery } from "@tanstack/react-query";
import { List, Typography } from "antd";
import { Link } from "react-router-dom";

import { getCourseContent } from "@/features/courses/api/courseApi";
import { getMyCourses } from "@/features/enrollments/api/enrollmentApi";
import { useAuthContext } from "@/features/auth/context/useAuthContext";
import { getPrimaryRole } from "@/shared/helpers/role";
import { ActivityType } from "@/shared/types/lms";

const { Title, Text } = Typography;

export default function AssignmentsHubPage() {
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
        <Title level={3}>Assignments</Title>
        <Text type="secondary">
          Assignment list is available to students for enrolled courses. Instructors
          manage assignments inside each course builder.
        </Text>
      </div>
    );
  }

  const items: { key: string; title: string; courseId: string; assignmentId: string }[] =
    [];

  (my.data ?? []).forEach((course, idx) => {
    const content = contents[idx]?.data;
    if (!content) return;
    for (const mod of content.modules) {
      for (const a of mod.activities ?? []) {
        if (a.type === ActivityType.Assignment && a.resourceId) {
          items.push({
            key: `${course.id}-${a.id}`,
            title: `${course.title} · ${a.title}`,
            courseId: course.id,
            assignmentId: a.resourceId,
          });
        }
      }
    }
  });

  return (
    <div>
      <Title level={3}>My assignments</Title>
      <List
        loading={my.isLoading || contents.some((c) => c.isLoading)}
        dataSource={items}
        locale={{ emptyText: "No assignments found in your enrolled courses." }}
        renderItem={(item) => (
          <List.Item>
            <Link
              to={`/courses/${item.courseId}/assignment/${item.assignmentId}`}
            >
              {item.title}
            </Link>
          </List.Item>
        )}
      />
    </div>
  );
}
