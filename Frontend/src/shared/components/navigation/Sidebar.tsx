import { Menu } from "antd";
import { useNavigate } from "react-router-dom";

import { getSidebarForRole } from "../../helpers/sidebar";
import type { UserRole } from "../../types/sidebar";

interface Props {
    role: UserRole;
}

export default function Sidebar({ role }: Props) {
    const navigate = useNavigate();

    const items = getSidebarForRole(role).map(item => ({
        key: item.key,
        label: item.label,
        icon: item.icon ? <item.icon /> : undefined
    }));

    return (
        <Menu
            mode="inline"
            items={items}
            onClick={({ key }) => {
                const clicked = getSidebarForRole(role).find(x => x.key === key);

                if (clicked) {
                    navigate(clicked.path);
                }
            }}
        />
    );
}
