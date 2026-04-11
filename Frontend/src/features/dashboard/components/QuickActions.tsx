import { Card, Button } from "antd";
import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <Card title="Quick Actions">
      <Button type="primary" block onClick={() => navigate("/courses/create")}>
        Create Course
      </Button>

      <Button style={{ marginTop: 10 }} block onClick={() => navigate("/courses")}>
        Browse Courses
      </Button>
    </Card>
  );
}
