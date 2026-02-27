import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div>
      <h1>Nav bar</h1>
      <Outlet />
      <h1>Footer</h1>
    </div>
  );
}
