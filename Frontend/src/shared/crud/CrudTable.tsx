import { useQuery } from "@tanstack/react-query";
import { Table } from "antd";
import type { CrudConfig } from "./types";

export function CrudTable<T extends {id: string}>(config: CrudConfig<T>) {
  const { data, isLoading } = useQuery({
    queryKey: [config.entityName],
    queryFn: config.fetchAll,
  });

  return (
    <Table
      loading={isLoading}
      columns={config.columns}
      dataSource={data}
      rowKey="id"
    />
  );
}
