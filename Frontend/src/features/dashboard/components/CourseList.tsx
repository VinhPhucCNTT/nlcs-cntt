import { List, Card } from "antd";

const mockCourses = [
  { id: 1, title: "React Basics" },
  { id: 2, title: "ASP.NET Core API" },
];

export default function CourseList() {
  return (
    <Card title="My Courses">
      <List
        dataSource={mockCourses}
        renderItem={(course) => (
          <List.Item key={course.id}>
            {course.title}
          </List.Item>
        )}
      />
    </Card>
  );
}
