import { Alert, Button, Card, Form, Input, Typography } from "antd";
import type { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useAuth";
import type { ILoginRequest } from "../types";
import { useAuthContext } from "../context/useAuthContext";

const { Title, Text } = Typography;

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuthContext();
    const { mutateAsync: loginMutation, isPending, error } = useLogin();

    const onFinish = async (values: ILoginRequest) => {
        const response = await loginMutation(values);
        login(response.token);
        navigate("/dashboard");
    };

    const getErrorMessage = () => {
        const axiosError = error as AxiosError | null;
        if (axiosError?.response?.status === 401) {
            return "Invalid email or password.";
        }
        return "Unable to login. Please try again.";
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
            <Card style={{ width: "100%", maxWidth: 420 }}>
                <Title level={3} style={{ marginTop: 0 }}>
                    Login
                </Title>
                <Text type="secondary">Sign in to continue.</Text>

                <Form<ILoginRequest>
                    layout="vertical"
                    onFinish={onFinish}
                    style={{ marginTop: 16 }}
                    autoComplete="off"
                >
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
                        rules={[{ required: true, message: "Please enter your password." }]}
                    >
                        <Input.Password placeholder="Enter your password" />
                    </Form.Item>

                    {error && (
                        <Form.Item>
                            <Alert type="error" showIcon title={getErrorMessage()} />
                        </Form.Item>
                    )}

                    <Form.Item style={{ marginBottom: 8 }}>
                        <Button type="primary" htmlType="submit" block loading={isPending}>
                            Login
                        </Button>
                    </Form.Item>
                </Form>

                <Text>
                    No account? <Link to="/register">Create one</Link>
                </Text>
            </Card>
        </div>
    );
}
