import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import { theme } from "./theme";
import type { ReactNode } from "react";
import { AuthProvider } from "@/features/auth/context/AuthProvider";

const queryClient = new QueryClient();

interface ProviderProp {
    children: ReactNode;
}

export default function Providers({ children }: ProviderProp) {
    return (
        <ConfigProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </QueryClientProvider>
        </ConfigProvider>
    );
}
