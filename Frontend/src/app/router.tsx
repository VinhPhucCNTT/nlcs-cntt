import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../shared/layouts/DashboardLayout";
import CourseListPage from "../features/courses/pages/CourseListPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { path: "courses", element: <CourseListPage /> },
    ],
  },
]);
