import { sidebarItems } from "../config/sidebar.config";
import type { UserRole } from "../types/sidebar";

export function getSidebarForRole(role: UserRole) {
    return sidebarItems.filter(item =>
        item.roles.includes(role)
    );
}
