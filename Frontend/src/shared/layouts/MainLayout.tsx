import { Layout, Breadcrumb, theme } from "antd";
import Sidebar from "../components/navigation/Sidebar";
import { Outlet } from "react-router-dom";

const { Header, Content, Sider } = Layout;

export default function MainLayout() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout>
            <Header style={{ display: "flex", alignItems: "center" }}>
                <div className="logo" />
                <div className="top-nav" />
            </Header>
            <Layout>
                <Sider width={200} style={{ background: colorBgContainer }} >
                    <Sidebar role="Admin" />
                </Sider>
                <Layout style={{ padding: "0 24px 24px" }} >
                    <Breadcrumb
                        items={[{ title: 'Home' }, { title: 'List' }, { title: 'App' }]}
                        style={{ margin: '16px 0' }}
                    />
                    <Content style={{
                        padding: 24,
                        margin: 0,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}>
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}
