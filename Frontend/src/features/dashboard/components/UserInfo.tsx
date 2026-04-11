import { Avatar, Typography, Flex, Card } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Title } = Typography;

export default function UserInfo() {
    const user = "user";

    return (
        <Card>
            <Flex gap="large" justify="left">
                <Avatar size={100} shape="square" icon={<UserOutlined />} />
                <Flex vertical align="flex-start">
                    <Title level={2} style={{marginTop: ".5rem", marginBottom: 0}}>Welcome back, <em>{user}</em>!</Title>
                    <Title level={2} style={{marginTop: ".5rem", marginBottom: 0, fontWeight: 350}}>Student</Title>
                </Flex>
            </Flex>
        </Card>
    );
}
