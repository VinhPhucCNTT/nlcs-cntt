import type { Rule } from "antd/es/form";
import type { ColumnsType } from "antd/es/table";

export interface CrudConfig<T extends { id: string }> {
  entityName: string;

  columns: ColumnsType<T>;
  formFields: FormField<T>[];

  enableSearch?: boolean;
  enableCreate?: boolean;

  fetchAll: () => Promise<T[]>;
  create: (data: Partial<T>) => Promise<void>;
  update: (id: string, data: Partial<T>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export interface FormField<T> {
  name: keyof T;
  label: string;
  component: React.ReactNode;
  rules?: Rule[];
}
