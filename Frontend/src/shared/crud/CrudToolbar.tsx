import { Button, Input, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import type { CrudConfig } from "./types";

interface CrudToolbarProps<T extends { id: string }> {
    config: CrudConfig<T>;
    onCreate?: () => void;
    onSearch?: (value: string) => void;
}

export function CrudToolbar<T extends { id: string }>({
    config,
    onCreate,
    onSearch,
}: CrudToolbarProps<T>) {
    const [search, setSearch] = useState("");

    return (
        <Space style={{ marginBottom: 16 }}>
            {config.enableSearch && <Input.Search
                placeholder={`Search ${config.entityName}`}
                allowClear
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onSearch={(value) => onSearch?.(value)}
                style={{ width: 250 }}
            />}

            {config.enableCreate && <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
                Create {config.entityName}
            </Button>}
        </Space>
    );
}
