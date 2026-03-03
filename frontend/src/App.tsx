import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import CheckAuth from "./components/common/check-auth";

import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
// import VerifyEmail from "./pages/auth/verify-email";
import { useAppDispatch, useAppSelector } from "./store/hook";
import { useEffect } from "react";
import { authCheck } from "./store/auth";
import UserCreated from "./pages/auth/userCreated";
import ForgotPassword from "./pages/auth/forgotpassword";
import ResetPassword from "./pages/auth/resetpassword";
import AuthLayout from "./layout/authLayout";

export default function App() {
  const { isAuthenticated, isLoading, user } = useAppSelector(
    (state) => state.auth,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(authCheck());
  }, [dispatch]);

  // if (isLoading) return <p>Loading... test</p>;

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <CheckAuth isAuthenticated={isAuthenticated} user={user ?? undefined}>
          <RootLayout />
        </CheckAuth>
      ),
      children: [],
    },
    // * Auth
    {
      path: "/auth",
      element: (
        <CheckAuth isAuthenticated={isAuthenticated} user={user ?? undefined}>
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
        {
          path: "create",
          element: <UserCreated />,
        },
      ],
    },

    //* user
    //* admin
    // {
    //   path: "verify/email",
    //   element: <VerifyEmail />,
    // },
    {
      path: "/password",
      children: [
        {
          path: "reset",
          element: <ResetPassword />,
        },
        {
          path: "forget",
          element: <ForgotPassword />,
        },
      ],
    },

    {
      path: "*",
      element: <ForgotPassword />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
