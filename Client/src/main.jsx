import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { store } from "./Store/index.js";
import { Loading } from "./Components";
import StudentLayout from "./Layout/StudentLayout.jsx";
import DeptTPOLayout from "./Layout/DeptTPOLayout.jsx";
import SPOCLayout from "./Layout/SPOCLayout.jsx";
import AdminLayout from "./Layout/AdminLayout.jsx";
import ErrorBoundary from "./Error/ErrorBoundary.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import AuthBootstrap from "./Components/AuthBootstrap.jsx";
import AuthRoute from "./Components/AuthRoute.jsx";

const NotFound = lazy(() => import("./Pages/Not Found/NotFound.jsx"));
const Landing = lazy(() => import("./Pages/Landing/Landing.jsx"));
const Contact = lazy(() => import("./Pages/Contact/Contact.jsx"));
const ForgotPassword = lazy(() => import("./Pages/Auth/ForgotPassword.jsx"));

// Students Routes
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

// Dept TPO Routes
const DeptTPOSignUp = lazy(() => import("./Pages/Auth/DeptTPOSignup.jsx"));
const DeptTPOLogin = lazy(() => import("./Pages/Auth/DeptTPOLogin.jsx"));
const DeptTPODashboard = lazy(
  () => import("./Pages/Services/DeptTPO/Dashboard/DeptTPODashboard.jsx"),
);
const DeptTPOApplications = lazy(
  () => import("./Pages/Services/DeptTPO/Applications/DeptTPOApplications.jsx"),
);
const AllCompanyApplications = lazy(
  () =>
    import("./Pages/Services/DeptTPO/Applications/AllCompanyApplications.jsx"),
);
const PendingApplications = lazy(
  () => import("./Pages/Services/DeptTPO/Applications/PendingApplications.jsx"),
);
const AcceptedApplications = lazy(
  () =>
    import("./Pages/Services/DeptTPO/Applications/ApprovedApplications.jsx"),
);
const RejectedApplications = lazy(
  () =>
    import("./Pages/Services/DeptTPO/Applications/RejectedApplications.jsx"),
);
const SentToTPOApplications = lazy(
  () =>
    import("./Pages/Services/DeptTPO/Applications/SentToTPOApplications.jsx"),
);
const CompanyApplicationDetails = lazy(
  () =>
    import("./Pages/Services/DeptTPO/Applications/CompanyApplicationDetails.jsx"),
);
const InternshipDeadlines = lazy(
  () => import("./Pages/Services/DeptTPO/Deadlines/InternshipDeadlines.jsx"),
);
const DeptTPONotifications = lazy(
  () =>
    import("./Pages/Services/DeptTPO/Notifications/DeptTPONotifications.jsx"),
);
const DeptTPOProfile = lazy(
  () => import("./Pages/Services/DeptTPO/Profile/DeptTPOProfile.jsx"),
);
const DeptTPOSettings = lazy(
  () => import("./Pages/Services/DeptTPO/Settings/Settings.jsx"),
);

// SPOC Routes
const SPOCSignup = lazy(() => import("./Pages/Auth/SPOCSignup.jsx"));
const SPOCLogin = lazy(() => import("./Pages/Auth/SPOCLogin.jsx"));
const SPOCDashboard = lazy(
  () => import("./Pages/Services/SPOC/SPOCDashboard.jsx.jsx"),
);
const SPOCApplications = lazy(
  () => import("./Pages/Services/SPOC/SPOCApplications.jsx"),
);
const SPOCNOC = lazy(() => import("./Pages/Services/SPOC/SPOCNOC.jsx"));
const SPOCProfile = lazy(() => import("./Pages/Services/SPOC/SPOCProfile.jsx"));

// Admin Routes
const AdminSignup = lazy(() => import("./Pages/Auth/AdminSignup.jsx"));
const AdminLogin = lazy(() => import("./Pages/Auth/AdminLogin.jsx"));
const AdminDashboard = lazy(
  () => import("./Pages/Services/Admin/Dashboard/AdminDashboard.jsx"),
);
const AdminStudents = lazy(
  () => import("./Pages/Services/Admin/Students/AdminStudents.jsx"),
);

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

// Protected routes wrapper
const ProtectedRoutes = () => {
  return (
    <ProtectedRoute>
      <App />
    </ProtectedRoute>
  );
};

// Student protected routes
const StudentProtectedRoutes = () => {
  return (
    <ProtectedRoute allowedRoles={["student"]} requireRole={true}>
      <StudentLayout />
    </ProtectedRoute>
  );
};

// Dept TPO protected routes
const DeptTPOProtectedRoutes = () => {
  return (
    <ProtectedRoute allowedRoles={["tpo"]} requireRole={true}>
      <DeptTPOLayout />
    </ProtectedRoute>
  );
};

// SPOC protected routes
const SPOCProtectedRoutes = () => {
  return (
    <ProtectedRoute allowedRoles={["spoc"]} requireRole={true}>
      <SPOCLayout />
    </ProtectedRoute>
  );
};

// Admin protected routes
const AdminProtectedRoutes = () => {
  return (
    <ProtectedRoute allowedRoles={["admin"]} requireRole={true}>
      <AdminLayout />
    </ProtectedRoute>
  );
};

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
        element: (
          <AuthRoute>
            <Login />
          </AuthRoute>
        ),
      },

      {
        path: "/auth/signup",
        element: (
          <AuthRoute>
            <Signup />
          </AuthRoute>
        ),
      },
      {
        path: "/auth/depttpo/signup",
        element: (
          <AuthRoute>
            <DeptTPOSignUp />
          </AuthRoute>
        ),
      },
      {
        path: "/auth/depttpo/login",
        element: (
          <AuthRoute>
            <DeptTPOLogin />
          </AuthRoute>
        ),
      },
      {
        path: "/auth/spoc/signup",
        element: (
          <AuthRoute>
            <SPOCSignup />
          </AuthRoute>
        ),
      },
      {
        path: "/auth/spoc/login",
        element: <SPOCLogin />,
      },
      {
        path: "/auth/admin/signup",
        element: (
          <AuthRoute>
            <AdminSignup />
          </AuthRoute>
        ),
      },
      {
        path: "/auth/admin/login",
        element: (
          <AuthRoute>
            <AdminLogin />
          </AuthRoute>
        ),
      },
      {
        path: "/auth/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },

      // Students Routes (Protected)
      {
        path: "/students",
        element: <StudentProtectedRoutes />,
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

      // Dept TPO Routes (Protected)
      {
        path: "depttpo",
        element: <DeptTPOProtectedRoutes />,
        children: [
          {
            path: "dashboard",
            element: <DeptTPODashboard />,
          },
          {
            path: "applications",
            element: <DeptTPOApplications />,
            children: [
              {
                index: true,
                element: <AllCompanyApplications />,
              },
              {
                path: "pending",
                element: <PendingApplications />,
              },
              {
                path: "accepted",
                element: <AcceptedApplications />,
              },
              {
                path: "rejected",
                element: <RejectedApplications />,
              },
              {
                path: "sent",
                element: <SentToTPOApplications />,
              },
              {
                path: ":companyId",
                element: <CompanyApplicationDetails />,
              },
            ],
          },
          {
            path: "deadlines",
            element: <InternshipDeadlines />,
          },
          {
            path: "notifications",
            element: <DeptTPONotifications />,
          },
          {
            path: "profile",
            element: <DeptTPOProfile />,
          },
          {
            path: "settings",
            element: <DeptTPOSettings />,
          },
        ],
      },

      // SPOC Routes (Protected)
      {
        path: "/spoc",
        element: <SPOCProtectedRoutes />,
        children: [
          {
            path: "/spoc/dashboard",
            element: <SPOCDashboard />,
          },
          {
            path: "/spoc/applications",
            element: <SPOCApplications />,
          },
          {
            path: "/spoc/nocs",
            element: <SPOCNOC />,
          },
          {
            path: "/spoc/profile",
            element: <SPOCProfile />,
          },
        ],
      },

      // Admin Routes (Protected)
      {
        path: "/admin",
        element: <AdminProtectedRoutes />,
        children: [
          {
            path: "/admin/dashboard",
            element: <AdminDashboard />,
          },
          {
            path: "/admin/students",
            element: <AdminStudents />,
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
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <AuthBootstrap>
            <Suspense fallback={<Loading message="Loading..." />}>
              <RouterProvider router={router} />
            </Suspense>
          </AuthBootstrap>
        </ErrorBoundary>
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
);
