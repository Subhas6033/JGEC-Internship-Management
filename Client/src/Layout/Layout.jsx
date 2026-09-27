import { Nav, Footer } from "../Components";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-cream text-ink">
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
