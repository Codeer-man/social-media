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
import ProfileLayout from "./layout/profileLayout";
import CreateProfile from "./pages/profile/createProfile";

export default function App() {
  const { isAuthenticated, isLoading, user } = useAppSelector(
    (state) => state.auth,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(authCheck());
  }, [dispatch]);

  if (isLoading) <p>Loading... test</p>;

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <CheckAuth
          isAuthenticated={isAuthenticated}
          user={user}
          isLoading={isLoading}
        >
          <RootLayout />
        </CheckAuth>
      ),
      children: [
        {
          //testing _________________________________
          path: "friends",
          element: <CreateProfile />,
        },
      ],
    },
    // * Auth
    {
      path: "/auth",
      element: (
        <CheckAuth
          isAuthenticated={isAuthenticated}
          user={user}
          isLoading={isLoading}
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
    {
      path: "user/created",
      element: <UserCreated />,
    },
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
    // create profile
    {
      path: "/profile",
      element: (
        <CheckAuth
          isAuthenticated={isAuthenticated}
          user={user}
          isLoading={isLoading}
        >
          <ProfileLayout />
        </CheckAuth>
      ),
      children: [{ path: "create", element: <CreateProfile /> }],
    },
    // test admin
    {
      path: "/admin",
      element: (
        <CheckAuth
          isAuthenticated={isAuthenticated}
          user={user}
          isLoading={isLoading}
        >
          <RootLayout />
        </CheckAuth>
      ),
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
