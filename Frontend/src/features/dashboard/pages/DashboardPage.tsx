import { Row, Col, Typography, Button, Space } from "antd";
import DashboardStats from "../components/DashboardStats";
import CourseList from "../components/CourseList";
import QuickActions from "../components/QuickActions";
import { useAuthContext } from "@/features/auth/context/useAuthContext";

const { Title } = Typography;

export default function DashboardPage() {
    const { logout } = useAuthContext();

    return (
        <div>
            <Space
                align="center"
                style={{
                    width: "100%",
                    justifyContent: "space-between",
                    marginBottom: 8,
                }}
            >
                <Title level={2} style={{ margin: 0 }}>
                    Dashboard
                </Title>
                <Button type="default" onClick={() => logout()}>
                    Log out
                </Button>
            </Space>

            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <DashboardStats />
                </Col>

                <Col span={16}>
                    <CourseList />
                </Col>

                <Col span={8}>
                    <QuickActions />
                </Col>
            </Row>
        </div>
    );
}
