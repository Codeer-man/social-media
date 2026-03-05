import { useState } from "react";
import { googleOAuth } from "../../store/auth";
import { useAppDispatch } from "../../store/hook";

export default function GoogleOAuth() {
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string>("");

  const onSubmit = async () => {
    try {
      const res = await dispatch(googleOAuth()).unwrap();
      window.location.href = res.link;
    } catch (error: any) {
      setError(error);
    }
  };

  return (
    <div>
      {/* Google */}
      <p>{error}</p>
      <button
        type="button"
        onClick={onSubmit}
        className="w-full flex items-center justify-center gap-3 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-700 cursor-pointer"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-5 h-5"
        />
        Continue with Google
      </button>
    </div>
  );
}
