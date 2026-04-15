import { Col, Row, Statistic, Space } from "antd";
import { useQuery } from "@tanstack/react-query";

import UserInfo from "./UserInfo";
import { useAuthContext } from "@/features/auth/context/useAuthContext";
import { getCourses } from "@/features/courses/api/courseApi";
import { getMyCourses } from "@/features/enrollments/api/enrollmentApi";
import { getPrimaryRole } from "@/shared/helpers/role";

export default function DashboardStats() {
  const { user } = useAuthContext();
  const role = getPrimaryRole(user?.roles);

  const mineStudent = useQuery({
    queryKey: ["enrollments", "my"],
    queryFn: getMyCourses,
    enabled: role === "Student",
  });

  const coursesAll = useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
    enabled: role === "Instructor" && !!user?.userId,
  });

  const teachingCount =
    role === "Instructor" && user?.userId
      ? (coursesAll.data ?? []).filter((c) => c.instructorId === user.userId)
          .length
      : 0;

  const enrolledCount =
    role === "Student" ? (mineStudent.data ?? []).length : undefined;

  return (
    <Row gutter={16}>
      <Col span={16}>
        <UserInfo />
      </Col>
      <Col span={8}>
        <Space size="large" wrap>
          {role === "Student" && (
            <Statistic title="Enrolled courses" value={enrolledCount ?? "—"} />
          )}
          {role === "Instructor" && (
            <Statistic title="Courses teaching" value={teachingCount} />
          )}
        </Space>
      </Col>
    </Row>
  );
}
