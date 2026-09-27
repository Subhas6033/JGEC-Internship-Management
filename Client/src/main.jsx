import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Loading } from "./Components/index.js";
import StudentLayout from "./Layout/StudentLayout.jsx";
import ErrorBoundary from "./Error/ErrorBoundary.jsx";

const NotFound = lazy(() => import("./Pages/Not Found/NotFound.jsx"));
const Landing = lazy(() => import("./Pages/Landing/Landing.jsx"));
const Contact = lazy(() => import("./Pages/Contact/Contact.jsx"));

const Login = lazy(() => import("./Pages/Auth/Login.jsx"));
const Signup = lazy(() => import("./Pages/Auth/Signup.jsx"));
const StudentDashboard = lazy(
  () => import("./Pages/Services/Students/Dashboard/StudentDashboard.jsx"),
);
const StudentApplications = lazy(
  () => import("./Pages/Services/Students/Applications/StudentApplication.jsx"),
);
const StudentApplicationsTrack = lazy(
  () =>
    import("./Pages/Services/Students/Applications/StudentApplications.jsx"),
);
const StudentDocuments = lazy(
  () => import("./Pages/Services/Students/Documents/StudentDocuments.jsx"),
);
const StudentNotifications = lazy(
  () =>
    import("./Pages/Services/Students/Notifications/StudentNotifications.jsx"),
);
const StudentProfile = lazy(
  () => import("./Pages/Services/Students/Profile/StudentProfile.jsx"),
);
const StudentsSettings = lazy(
  () => import("./Pages/Services/Students/Settings/Settings.jsx"),
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Landing />,
      },

      {
        path: "/auth/login",
        element: <Login />,
      },

      {
        path: "/auth/signup",
        element: <Signup />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },

      {
        path: "/students",
        element: <StudentLayout />,
        children: [
          {
            path: "/students/dashboard",
            element: <StudentDashboard />,
          },
          {
            path: "/students/applications/new",
            element: <StudentApplications />,
          },
          {
            path: "/students/applications",
            element: <StudentApplicationsTrack />,
          },
          {
            path: "/students/documents",
            element: <StudentDocuments />,
          },
          {
            path: "/students/notifications",
            element: <StudentNotifications />,
          },
          {
            path: "/students/profile",
            element: <StudentProfile />,
          },
          {
            path: "/students/settings",
            element: <StudentsSettings />,
          },
        ],
      },
    ],
  },

  // 404 route handelling
  {
    path: "*",
    element: <NotFound />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<Loading message="Loading..." />}>
        <RouterProvider router={router} />
      </Suspense>
    </ErrorBoundary>
  </StrictMode>,
);
