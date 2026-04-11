import { Avatar, Typography, Flex, Card } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useAuthContext } from "@/features/auth/context/useAuthContext";

const { Title } = Typography;

export default function UserInfo() {
    const { user } = useAuthContext();
    console.log(user);

    return (
        <Card>
            <Flex gap="large" justify="left">
                <Avatar size={100} shape="square" icon={<UserOutlined />} />
                <Flex vertical align="flex-start">
                    <Title level={2} style={{ marginTop: ".5rem", marginBottom: 0 }}>Welcome back, <em>{user === null ? "Anon" : user.email}</em>!</Title>
                    <Title level={2} style={{ marginTop: ".5rem", marginBottom: 0, fontWeight: 350 }}>{user === null ? "Unknown" : user.roles[0]}</Title>
                </Flex>
            </Flex>
        </Card>
    );
}
