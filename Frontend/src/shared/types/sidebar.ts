import type { ComponentType } from "react";

export type UserRole =
    | "Student"
    | "Instructor"
    | "Admin";

export interface SidebarItem {
    key: string;
    label: string;
    path: string;
    icon?: ComponentType;
    roles: UserRole[];
    children?: SidebarItem[];
}
