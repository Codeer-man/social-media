import { Outlet } from "react-router-dom";

export default function ProfileLayout() {
  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center">
      <Outlet />
    </div>
  );
}
