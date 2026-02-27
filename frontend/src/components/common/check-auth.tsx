import type React from "react";
import { Navigate, useLocation } from "react-router-dom";

export type role = "user" | "admin";

interface AuthProps {
  isAuthenticated?: boolean;
  user?: {
    id: string;
    userName: string;
    role: "user" | "admin";
  } | null;
  children?: React.ReactNode;
}

export default function CheckAuth({
  isAuthenticated,
  children,
  user,
}: AuthProps) {
  const location = useLocation();

  //auth route
  if (
    !isAuthenticated &&
    !(
      location.pathname.includes("/login") ||
      location.pathname.includes("/register")
    )
  ) {
    return <Navigate to={"/auth/login"} />;
  }

  //role based route
  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("register"))
  ) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/" />;
    }
  }

  //
  if (
    isAuthenticated &&
    user?.role === "user" &&
    location.pathname.includes("admin")
  ) {
    return <Navigate to={"/unauth-page"} />;
  }

  if (
    isAuthenticated &&
    user?.role === "admin" &&
    !location.pathname.includes("admin")
  ) {
    return <Navigate to={"/admin/dashboard"} />;
  }

  return <>{children}</>;
}
