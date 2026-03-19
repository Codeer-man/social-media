import type React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface User {
  profile: string | null;
  role: "user" | "admin";
}

interface CheckAuthProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  children: React.ReactNode;
}

const PUBLIC_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/user/created",
  "/password/reset",
  "/password/forget",
];

const ROLE_HOME: Record<User["role"], string> = {
  admin: "/admin/dashboard",
  user: "/",
};

export default function CheckAuth({
  isAuthenticated,
  isLoading,
  user,
  children,
}: CheckAuthProps) {
  const { pathname } = useLocation();

  if (!pathname.includes("/auth")) {
    if (isLoading) return null; // or a <Spinner />
  }

  const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
  const isAuthRoute = pathname.startsWith("/auth");
  const isAdminRoute = pathname.startsWith("/admin");

  // 1. Unauthenticated: only allow public routes
  if (!isAuthenticated) {
    return isPublicRoute ? (
      <>{children}</>
    ) : (
      <Navigate to="/auth/login" replace />
    );
  }

  // 2. Authenticated user hitting an auth page → redirect to their home
  if (isAuthRoute) {
    return <Navigate to={ROLE_HOME[user!.role]} replace />;
  }

  //5. no profile user naivgatet to create/profile
  //5. no profile user → navigate to create/profile
  if (user?.profile === null && pathname !== "/profile/create") {
    return <Navigate to="/profile/create" replace />;
  }

  // 3. Non-admin trying to access admin routes
  if (isAdminRoute && user?.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. Admin trying to access non-admin routes
  if (!isAdminRoute && user?.role === "admin") {
    return <Navigate to={ROLE_HOME.admin} replace />;
  }

  return <>{children}</>;
}
