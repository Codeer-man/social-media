import { logoutUser } from "../../store/auth";
import { useAppDispatch } from "../../store/hook";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // let success: boolean = true;

  async function handleLogout() {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/auth/login");
    } catch (error: any) {
      // success = false;
    }
  }
  return (
    <div>
      {/* {success ? "" : "Something went wrong"} */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
