import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../shared/layouts/DashboardLayout";
import CourseListPage from "../features/courses/pages/CourseListPage";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { path: "courses", element: <CourseListPage /> },
    ],
  },
]);
