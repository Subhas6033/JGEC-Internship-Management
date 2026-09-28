import { useLocation } from "react-router-dom";
import { Nav, Footer } from "../Components";

const Layout = ({ children }) => {
  const { pathname } = useLocation();

  const isAuthRoute = pathname.startsWith("/auth");
  const isStudentRoute = pathname.startsWith("/students");
  const isDeptTPORoutes = pathname.startsWith("/depttpo");
  const isTPORoutes = pathname.startsWith("/spoc");
  const isAdmin = pathname.startsWith("/admin");

  // Error / Not Found page
  const isNotFoundRoute = pathname === "/404";

  // Pages without public navigation
  if (
    isAuthRoute ||
    isStudentRoute ||
    isDeptTPORoutes ||
    isTPORoutes ||
    isAdmin ||
    isNotFoundRoute
  ) {
    return (
      <div className="min-h-screen bg-cream text-ink">
        <main className="w-full">{children}</main>
      </div>
    );
  }

  // Public application pages
  return (
    <div className="flex min-h-screen flex-col bg-cream text-ink">
      <Nav />

      <main className="w-full flex-1">
        <div className="mx-auto w-full max-w-auto px-5 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
