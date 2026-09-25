import { Outlet } from "react-router-dom";
import Layout from "./Layout/Layout";

const App = () => {
  return (
    <Layout className="text-center bg-blue-500">
      <Outlet />
    </Layout>
  );
};

export default App;
