import { Outlet } from "react-router-dom";
import Logout from "../pages/auth/logout";

export default function RootLayout() {
  return (
    <div>
      <h1>Nav bar</h1>
      <Logout />
      <Outlet />
      <h1>Footer</h1>
    </div>
  );
}
