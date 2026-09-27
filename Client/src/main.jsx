import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Loading } from "./Components/index.js";

const Landing = lazy(() => import("./Pages/Landing/Landing.jsx"));
const Login = lazy(() => import("./Pages/Auth/Login.jsx"));
const Signup = lazy(() => import("./Pages/Auth/Signup.jsx"));

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
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Suspense fallback={<Loading message="Loading..." />}>
      <RouterProvider router={router} />
    </Suspense>
  </StrictMode>,
);
