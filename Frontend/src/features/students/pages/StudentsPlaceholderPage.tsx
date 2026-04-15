import { Typography } from "antd";

const { Title, Paragraph } = Typography;

export default function StudentsPlaceholderPage() {
  return (
    <div>
      <Title level={3}>Students</Title>
      <Paragraph type="secondary">
        A dedicated student roster is not exposed by the API yet. Use course enrollments
        from individual courses when that endpoint exists.
      </Paragraph>
    </div>
  );
}
