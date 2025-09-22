import { createBrowserRouter } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/home";
import Layout from "./components/layout";
import DashboardPage from "./pages/privatePages/dashboard";
import PrivateRoute from "./pages/privatePages";
import UserPage from "./pages/privatePages/userPage";
import ResourcesPage from "./pages/privatePages/resources";
import LogsPage from "./pages/privatePages/logPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: "/dashboard",
        element: (
          <PrivateRoute allowedRoles={["admin", "employee", "manager"]}>
            {(user) => <DashboardPage currentUser={user} />}
          </PrivateRoute>
        ),
      },
      {
        path: "/users",
        element: (
          <PrivateRoute allowedRoles={["admin", "manager"]}>
            {(user) => <UserPage currentUser={user} />}
          </PrivateRoute>
        ),
      },
      {
        path: "/resources",
        element: (
          <PrivateRoute allowedRoles={["admin", "employee", "manager"]}>
            {(user) => <ResourcesPage currentUser={user} />}
          </PrivateRoute>
        ),
      },
      {
        path: "/logs",
        element: (
          <PrivateRoute allowedRoles={["admin", "manager"]}>
            {(user) => <LogsPage currentUser={user} />}
          </PrivateRoute>
        ),
      },
      {
        path: "*",
        element: <h1>404</h1>,
      },
    ],
  },
]);

export default router;
