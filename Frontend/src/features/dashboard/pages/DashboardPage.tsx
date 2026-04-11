import { Row, Col, Typography } from "antd";
import DashboardStats from "../components/DashboardStats";
import CourseList from "../components/CourseList";
import QuickActions from "../components/QuickActions";

const { Title } = Typography;

export default function DashboardPage() {
    return (
        <div>
            <Title level={2}>Dashboard</Title>

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
