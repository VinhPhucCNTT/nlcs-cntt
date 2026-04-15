import { Avatar, Typography, Flex, Card } from "antd";
import { UserOutlined } from "@ant-design/icons";

import { useAuthContext } from "@/features/auth/context/useAuthContext";
import { getPrimaryRole } from "@/shared/helpers/role";

const { Title, Text } = Typography;

export default function UserInfo() {
  const { user } = useAuthContext();
  const role = user ? getPrimaryRole(user.roles) : "—";

  return (
    <Card>
      <Flex gap="large" justify="left">
        <Avatar size={100} shape="square" icon={<UserOutlined />} />
        <Flex vertical align="flex-start">
          <Title
            level={2}
            style={{ marginTop: ".5rem", marginBottom: 0 }}
          >
            Welcome back,{" "}
            <em>{user === null ? "guest" : user.email}</em>
          </Title>
          <Text style={{ fontSize: 18 }}>Role: {role}</Text>
        </Flex>
      </Flex>
    </Card>
  );
}

