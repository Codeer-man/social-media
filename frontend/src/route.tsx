import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import CheckAuth from "./components/common/check-auth";

// dummy data
const isAuth = false;

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <CheckAuth
        isAuthenticated={false}
        user={{ id: "dsf", userName: "sdf", role: "user" }}
      />
    ),
    children: [
      // * Auth
      {
        path: "auth",
        element: (
          <CheckAuth
            isAuthenticated={isAuth}
            user={{ id: "dsf", userName: "sdf", role: "user" }}
          >
            <AuthLayout />
          </CheckAuth>
        ),
        children: [
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "register",
            element: <Register />,
          },
        ],
      },
      //* user
      //* admin
    ],
  },
]);
