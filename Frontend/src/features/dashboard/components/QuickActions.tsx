import { Card, Button } from "antd";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "@/features/auth/context/useAuthContext";
import { getPrimaryRole } from "@/shared/helpers/role";

export default function QuickActions() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const role = getPrimaryRole(user?.roles);

  return (
    <Card title="Quick actions">
      <Button type="primary" block onClick={() => navigate("/courses")}>
        {role === "Instructor" ? "Manage courses" : "Browse courses"}
      </Button>

      {role === "Student" && (
        <Button style={{ marginTop: 10 }} block onClick={() => navigate("/assignments")}>
          My assignments
        </Button>
      )}
    </Card>
  );
}
