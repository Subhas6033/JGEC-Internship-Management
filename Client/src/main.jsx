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
const Login = lazy(() => import("./Pages/Auth/Login.jsx"));
const Signup = lazy(() => import("./Pages/Auth/Signup.jsx"));
const StudentDashboard = lazy(
  () => import("./Pages/Services/Students/Dashboard/StudentDashboard.jsx"),
);
const StudentApplications = lazy(
  () => import("./Pages/Services/Students/Applications/StudentApplication.jsx"),
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
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
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
