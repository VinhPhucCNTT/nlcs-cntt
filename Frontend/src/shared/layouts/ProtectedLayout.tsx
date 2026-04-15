import { Navigate, Outlet } from "react-router-dom";

import { useAuthContext } from "@/features/auth/context/useAuthContext";

export default function ProtectedLayout() {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
