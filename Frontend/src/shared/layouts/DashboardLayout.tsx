import { Layout, Menu } from "antd";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Sider>
        <Menu
          items={[
            { key: "courses", label: "Courses" },
            { key: "students", label: "Students" },
          ]}
        />
      </Layout.Sider>

      <Layout.Content style={{ padding: 24 }}>
        <Outlet />
      </Layout.Content>
    </Layout>
  );
}
