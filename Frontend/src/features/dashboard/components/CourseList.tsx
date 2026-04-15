import { useQuery } from "@tanstack/react-query";
import { Card, List, Typography } from "antd";
import { Link } from "react-router-dom";

import { useAuthContext } from "@/features/auth/context/useAuthContext";
import { getCourses } from "@/features/courses/api/courseApi";
import { getMyCourses } from "@/features/enrollments/api/enrollmentApi";
import { getPrimaryRole } from "@/shared/helpers/role";

const { Text } = Typography;

export default function CourseList() {
  const { user } = useAuthContext();
  const role = getPrimaryRole(user?.roles);

  const instructorCourses = useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
    enabled: role === "Instructor" && !!user?.userId,
    select: (courses) =>
      courses.filter((c) => c.instructorId === user!.userId),
  });

  const studentCourses = useQuery({
    queryKey: ["enrollments", "my"],
    queryFn: getMyCourses,
    enabled: role === "Student",
  });

  const data =
    role === "Student"
      ? studentCourses.data ?? []
      : role === "Instructor"
        ? instructorCourses.data ?? []
        : [];

  const loading =
    role === "Student"
      ? studentCourses.isLoading
      : role === "Instructor"
        ? instructorCourses.isLoading
        : false;

  return (
    <Card title={role === "Student" ? "My courses" : "My teaching"}>
      <List
        loading={loading}
        dataSource={data}
        locale={{
          emptyText:
            role === "Student"
              ? "You are not enrolled in any course yet."
              : "No courses yet. Create one from the Courses page.",
        }}
        renderItem={(course) => (
          <List.Item>
            <Link to={`/courses/${course.id}`}>{course.title}</Link>
            <Text type="secondary" style={{ marginLeft: 8 }}>
              {course.moduleCount} modules
            </Text>
          </List.Item>
        )}
      />
    </Card>
  );
}
