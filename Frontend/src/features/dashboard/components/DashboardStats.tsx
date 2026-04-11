import { Col, Row, Statistic, Space } from "antd";

import UserInfo from "./UserInfo";

export default function DashboardStats() {
    return (
        <Row gutter={16}>
            <Col span={16}>
                <UserInfo />
            </Col>
            <Col span={8}>
                <Space size="large" style={{ fontSize: "4rem" }}>
                    <Statistic title="Enrolled" value={5} />
                    <Statistic title="Completed" value={3} />
                    <Statistic title="Ongoing" value={2} />
                </Space>
            </Col>
        </Row>
    );
}
