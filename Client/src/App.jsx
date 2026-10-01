import { Outlet } from "react-router-dom";
import Layout from "./Layout/Layout";

// App component renders the main layout with nested routes
const App = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default App;
