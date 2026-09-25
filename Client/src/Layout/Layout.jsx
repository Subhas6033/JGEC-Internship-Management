import { Nav, Footer } from "../Components/index";

const Layout = ({ children }) => {
  return (
    <>
      <Nav />
      <main className="max-w-7xl p-2 ">{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
