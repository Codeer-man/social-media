import type React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface User {
  role: "user" | "admin";
}

interface CheckAuthProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null | undefined;
  children: React.ReactNode;
}

const PUBLIC_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/user/created",
  "/password/reset",
  "/password/forget",
];

export default function CheckAuth({
  isAuthenticated,
  isLoading,
  user,
  children,
}: CheckAuthProps) {
  const { pathname } = useLocation();

  // Wait for auth to resolve
  if (isLoading) return null;

  const isPublic = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));

  // Not logged in → go to login
  if (!isAuthenticated) {
    return isPublic ? <>{children}</> : <Navigate to="/auth/login" replace />;
  }

  // Logged in → can't go to login/register
  if (pathname.startsWith("/auth")) {
    return <Navigate to="/" replace />;
  }

  // Logged in as user → can't go to admin
  if (user?.role === "user" && pathname.startsWith("/admin")) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Logged in as admin → must stay in /admin
  if (user?.role === "admin" && !pathname.startsWith("/admin")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
}
