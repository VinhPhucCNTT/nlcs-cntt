import { createBrowserRouter, Navigate } from "react-router-dom";

import DashboardPage from "../features/dashboard/pages/DashboardPage";
import CourseListPage from "../features/courses/pages/CourseListPage";
import CourseDetailPage from "../features/courses/pages/CourseDetailPage";
import CourseBuilderPage from "../features/instructor/pages/CourseBuilderPage";
import LessonPage from "../features/learning/pages/LessonPage";
import AssignmentPage from "../features/learning/pages/AssignmentPage";
import AssessmentPage from "../features/learning/pages/AssessmentPage";
import AssignmentsHubPage from "../features/assignments/pages/AssignmentsHubPage";
import ExamsHubPage from "../features/exams/pages/ExamsHubPage";
import StudentsPlaceholderPage from "../features/students/pages/StudentsPlaceholderPage";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import MainLayout from "../shared/layouts/MainLayout";
import ProtectedLayout from "../shared/layouts/ProtectedLayout";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: "/",
        Component: MainLayout,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: "dashboard", element: <DashboardPage /> },
          { path: "courses", element: <CourseListPage /> },
          { path: "courses/:courseId", element: <CourseDetailPage /> },
          {
            path: "courses/:courseId/build",
            element: <CourseBuilderPage />,
          },
          {
            path: "courses/:courseId/lesson/:lessonId",
            element: <LessonPage />,
          },
          {
            path: "courses/:courseId/assignment/:assignmentId",
            element: <AssignmentPage />,
          },
          {
            path: "courses/:courseId/assessment/:assessmentId",
            element: <AssessmentPage />,
          },
          { path: "assignments", element: <AssignmentsHubPage /> },
          { path: "exams", element: <ExamsHubPage /> },
          { path: "students", element: <StudentsPlaceholderPage /> },
        ],
      },
    ],
  },
]);
