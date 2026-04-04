import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import { theme } from "./theme";

const queryClient = new QueryClient();

export default function Providers({ children }) {
  return (
    <ConfigProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ConfigProvider>
  );
}
