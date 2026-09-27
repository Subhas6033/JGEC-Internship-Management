import { useLocation } from "react-router-dom";
import { Nav, Footer } from "../Components";

const Layout = ({ children }) => {
  const { pathname } = useLocation();

  const isAuthRoute = pathname.startsWith("/auth");
  const isStudentRoute = pathname.startsWith("/students");
  const isDeptTPORoutes = pathname.startsWith("/dpttpo");
  const isTPORoutes = pathname.startsWith("/tpo");
  const isAdmin = pathname.startsWith("/admin");

  // Authentication pages
  if (isAuthRoute) {
    return (
      <div className="min-h-screen bg-cream text-ink">
        <main className="w-full">{children}</main>
      </div>
    );
  }

  // Authenticated routes
  // Do not render the public navbar or footer here.
  if (isStudentRoute || isDeptTPORoutes || isTPORoutes || isAdmin) {
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
