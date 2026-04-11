import {
    DashboardOutlined,
    BookOutlined,
    FileTextOutlined,
    FormOutlined,
    TeamOutlined,
    SettingOutlined
} from "@ant-design/icons";

import type { SidebarItem } from "../types/sidebar";

export const sidebarItems: SidebarItem[] = [
    {
        key: "dashboard",
        label: "Dashboard",
        path: "/dashboard",
        icon: DashboardOutlined,
        roles: ["Student", "Instructor", "Admin"]
    },

    {
        key: "courses",
        label: "Courses",
        path: "/courses",
        icon: BookOutlined,
        roles: ["Student", "Instructor", "Admin"]
    },

    {
        key: "assignments",
        label: "Assignments",
        path: "/assignments",
        icon: FileTextOutlined,
        roles: ["Student", "Instructor"]
    },

    {
        key: "exams",
        label: "Exams",
        path: "/exams",
        icon: FormOutlined,
        roles: ["Student", "Instructor"]
    },

    {
        key: "students",
        label: "Students",
        path: "/students",
        icon: TeamOutlined,
        roles: ["Instructor"]
    },

    {
        key: "users",
        label: "Users",
        path: "/users",
        icon: TeamOutlined,
        roles: ["Admin"]
    },

    {
        key: "settings",
        label: "Settings",
        path: "/settings",
        icon: SettingOutlined,
        roles: ["Admin"]
    }
];
