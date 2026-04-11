import { useQuery } from "@tanstack/react-query";
import { Table } from "antd";
import type { CrudConfig } from "./types";

interface CrudTableProps<T extends { id: string }> {
  config: CrudConfig<T>;
  search: string;
}

export function CrudTable<T extends { id: string }>({ config, search }: CrudTableProps<T>) {
  const { data, isLoading } = useQuery({
    queryKey: [config.entityName],
    queryFn: config.fetchAll,
  });

  // Simple client-side filtering based on search if needed, 
  // though typically this might be handled by the API or a more complex filter logic.
  const filteredData = data?.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <Table
      loading={isLoading}
      columns={config.columns}
      dataSource={filteredData}
      rowKey="id"
    />
  );
}
