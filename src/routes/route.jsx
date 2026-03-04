import { createBrowserRouter, Navigate, redirect } from "react-router-dom";
import ErrorPage from "../pages/error/ErrorPage.jsx";
import LoginPage from "../pages/auth/LoginPage.jsx";
import RegisterPage from "../pages/auth/RegisterPage.jsx";
import NotFoundPage from "../pages/error/NotFoundPage.jsx";
import { getStoredSession } from "../lib/session.js";
import LandingPage from "../pages/LandingPage.jsx";
import AppLayout from "../components/layout/AppLayout.jsx";
import StudentDashboard from "../pages/student/StudentDashboard.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AdminAnnouncements from "../pages/admin/AdminAnnouncements.jsx";
import AdminApplications from "../pages/admin/AdminApplications.jsx";
import AdminComplaints from "../pages/admin/AdminComplaints.jsx";
import AdminFees from "../pages/admin/AdminFees.jsx";
import AdminHostels from "../pages/admin/AdminHostels.jsx";
import AdminPayments from "../pages/admin/AdminPayments.jsx";
import AdminRooms from "../pages/admin/AdminRooms.jsx";
import AdminStudents from "../pages/admin/AdminStudents.jsx";
import StudentApply from "../pages/student/StudentApply.jsx";
import StudentComplaints from "../pages/student/StudentComplaints.jsx";
import StudentPayments from "../pages/student/StudentPayments.jsx";
import StudentRoom from "../pages/student/StudentRoom.jsx";

function redirectIfAuthenticated() {
  const user = getStoredSession();
  console.log(user);

  if (user) {
    throw redirect(
      user.role === "admin" ? "/admin/dashboard" : "/student/dashboard"
    );
  }

  return null;
}

function requireRole(role) {
  const user = getStoredSession();

  if (!user) {
    throw redirect("/login");
  }

  if (user.role !== role) {
    throw redirect(
      user.role === "admin" ? "/admin/dashboard" : "/student/dashboard"
    );
  }

  return null;
}
const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <LandingPage />,
        loader: redirectIfAuthenticated,
      },
      {
        path: "login",
        element: <LoginPage />,
        loader: redirectIfAuthenticated,
      },
      {
        path: "register",
        element: <RegisterPage />,
        loader: redirectIfAuthenticated,
      },

      {
        path: "student",
        loader: () => requireRole("student"),
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },

          { path: "dashboard", element: <StudentDashboard /> },
          { path: "apply", element: <StudentApply /> },
          { path: "room", element: <StudentRoom /> },
          { path: "payments", element: <StudentPayments /> },
          { path: "complaints", element: <StudentComplaints /> },

          { path: "*", element: <NotFoundPage /> },
        ],
      },
      {
        path: "admin",
        loader: () => requireRole("admin"),
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },

          { path: "dashboard", element: <AdminDashboard /> },
          { path: "hostels", element: <AdminHostels /> },
          { path: "rooms", element: <AdminRooms /> },
          { path: "students", element: <AdminStudents /> },
          { path: "applications", element: <AdminApplications /> },
          { path: "payments", element: <AdminPayments /> },
          { path: "fees", element: <AdminFees /> },
          { path: "complaints", element: <AdminComplaints /> },
          { path: "announcements", element: <AdminAnnouncements /> },

          { path: "*", element: <NotFoundPage /> },
        ],
      },

      // GLOBAL 404
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
