import { Outlet, useLocation } from "react-router-dom";

function AuthLayout() {
  const location = useLocation();
  const isLogin = location.pathname.includes("login");

  const title = isLogin ? "Welcome back to Aura" : "Welcome  to Aura";
  return (
    <div className="min-h-screen w-full bg-zinc-100">
      <div className="px-8 py-5 flex items-center justify-between">
        <img src="/logo.svg" alt="logo" width={250} />
        <p className="text-lg text-gray-400 hidden sm:block">
          Your journey to self-discovery starts here ✨
        </p>
      </div>

      <div className="flex flex-col items-center justify-center ">
        {/* Heading above card */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          <p className="text-gray-400 text-sm mt-1">
            Explore your aura and unlock your potential
          </p>
        </div>

        <div className="w-full max-w-md rounded-2xl shadow-[0_0_25px_4px_rgba(0,0,0,0.08)] px-8 py-6">
          <Outlet />
        </div>

        <p className="text-xs text-gray-400 mt-3">
          © {new Date().getFullYear()} Aura. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default AuthLayout;
