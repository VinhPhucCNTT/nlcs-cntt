import { createBrowserRouter } from "react-router-dom";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import CourseListPage from "../features/courses/pages/CourseListPage";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import MainLayout from "../shared/layouts/MainLayout";

export const router = createBrowserRouter([
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
    {
        Component: MainLayout,
        children: [
            { path: "courses", element: <CourseListPage /> },
            { path: "dashboard", element: <DashboardPage /> },
            // { path: "users", element: <UsersPage /> >,
        ],
    },
]);
