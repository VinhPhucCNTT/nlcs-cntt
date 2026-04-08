import { Alert, Button, Card, Form, Input, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useRegister } from "../hooks/useAuth";
import type { IIdentityError, IRegisterRequest } from "../types";

interface IRegisterFormValues extends IRegisterRequest {
  confirmPassword: string;
}

const { Title, Text } = Typography;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const { mutateAsync: register, isPending, error } = useRegister();

  const onFinish = async (values: IRegisterFormValues) => {
    const { confirmPassword: _confirmPassword, ...payload } = values;
    await register(payload);
    messageApi.success("Registration successful. Please login.");
    navigate("/login");
  };

  const getErrorMessage = () => {
    const status = error?.response?.status;
    if (status === 401) {
      return "An account with this email already exists.";
    }

    if (status === 400 && Array.isArray(error?.response?.data)) {
      return error.response.data
        .map((item: IIdentityError) => item.Description)
        .join(" ");
    }

    return "Unable to register. Please try again.";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 16,
      }}
    >
      {contextHolder}
      <Card style={{ width: "100%", maxWidth: 460 }}>
        <Title level={3} style={{ marginTop: 0 }}>
          Register
        </Title>
        <Text type="secondary">Create your account to get started.</Text>

        <Form<IRegisterFormValues>
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: 16 }}
          autoComplete="off"
        >
          <Form.Item
            label="Full name"
            name="fullName"
            rules={[
              { required: true, message: "Please enter your full name." },
            ]}
          >
            <Input placeholder="Nguyen Van A" />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter a username." }]}
          >
            <Input placeholder="username" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email." },
              { type: "email", message: "Please enter a valid email." },
            ]}
          >
            <Input placeholder="you@example.com" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter a password." }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item
            label="Confirm password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password." },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Password confirmation does not match."),
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Re-enter your password" />
          </Form.Item>

          {error && (
            <Form.Item>
              <Alert type="error" showIcon message={getErrorMessage()} />
            </Form.Item>
          )}

          <Form.Item style={{ marginBottom: 8 }}>
            <Button type="primary" htmlType="submit" block loading={isPending}>
              Register
            </Button>
          </Form.Item>
        </Form>

        <Text>
          Already have an account? <Link to="/login">Sign in</Link>
        </Text>
      </Card>
    </div>
  );
}
