import { Layout, Breadcrumb, theme, Dropdown, Button, Space } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import type { ItemType } from "antd/es/breadcrumb/Breadcrumb";

import Sidebar from "../components/navigation/Sidebar";
import { useAuthContext } from "@/features/auth/context/useAuthContext";
import { getPrimaryRole } from "../helpers/role";

const { Header, Content, Sider } = Layout;

function breadcrumbFromPath(pathname: string): ItemType[] {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return [{ title: "Home" }];

  const items: ItemType[] = [{ title: <Link to="/dashboard">Home</Link> }];
  let path = "";
  const label: Record<string, string> = {
    dashboard: "Dashboard",
    courses: "Courses",
    assignments: "Assignments",
    exams: "Exams",
    lesson: "Lesson",
    assignment: "Assignment",
    assessment: "Assessment",
    build: "Build",
  };

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]!;
    path += `/${seg}`;
    const isLast = i === segments.length - 1;
    const text = label[seg] ?? seg;
    items.push({
      title: isLast ? text : <Link to={path}>{text}</Link>,
    });
  }

  return items;
}

export default function MainLayout() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const location = useLocation();
  const { user, logout } = useAuthContext();
  const role = getPrimaryRole(user?.roles);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingInline: 24,
        }}
      >
        <Link to="/dashboard" style={{ color: "inherit", fontWeight: 600 }}>
          LMS
        </Link>
        <Space>
          <span style={{ fontSize: 13, opacity: 0.85 }}>{user?.email}</span>
          <Dropdown
            menu={{
              items: [{ key: "logout", label: "Log out", onClick: () => logout() }],
            }}
          >
            <Button type="text" size="small">
              Account
            </Button>
          </Dropdown>
        </Space>
      </Header>
      <Layout>
        <Sider width={220} style={{ background: colorBgContainer }}>
          <Sidebar role={role} />
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>
          <Breadcrumb
            items={breadcrumbFromPath(location.pathname)}
            style={{ margin: "16px 0" }}
          />
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
