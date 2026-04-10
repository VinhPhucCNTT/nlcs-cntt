import { Form } from "antd";
import type { CrudConfig } from "./types";

export function CrudFormModal<T extends { id: string }>(config: CrudConfig<T>) {
    return (<Form layout="vertical">
        {
            config.formFields.map(field => (
                <Form.Item
                    key={field.name as string}
                    name={field.name as string}
                    label={field.label}
                    rules={field.rules}
                >
                    {field.component}
                </Form.Item>
            ))
        }
    </Form>);
}
