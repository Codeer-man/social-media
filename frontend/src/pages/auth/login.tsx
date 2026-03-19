import { useForm } from "react-hook-form";
import { useAppDispatch } from "../../store/hook";
import { loginSchema, type loginFormData } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser } from "../../store/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

//icons
import { IoIosEyeOff, IoMdEye } from "react-icons/io";
import GoogleOAuth from "../../components/oAuth/google";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<loginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: loginFormData) {
    try {
      const res = await dispatch(loginUser(data)).unwrap();

      if (res.user.profile === null) {
        navigate("/profile/create");
      } else {
        navigate("/");
      }
      window.location.reload();
    } catch (error: any) {
      setError("root", {
        type: "server",
        message: error,
      });
    }
  }

  return (
    <div>
      {errors.root && (
        <div className="  p-3 border rounded-lg border-red-200 mb-4  bg-red-50">
          <p className=" text-red-600 font-medium text-sm">
            {errors.root.message}
          </p>
        </div>
      )}

      <h1 className=" font-bold text-2xl text-gray-800 mb-6">
        Enter your credentials
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className=" flex flex-col gap-4">
        {/* email  */}
        <div className=" flex flex-col gap-1">
          <label className=" text-sm font-medium text-gray-700">Email:</label>
          <input
            type="text"
            disabled={isSubmitting}
            placeholder="@example.com"
            {...register("email")}
            className={` border rounded-lg text-sm px-4 py-2  outline-none transition focus:ring-2 focus:ring-amber-300 focus:border-transparent ${
              errors.email ? "border-red-400 bg-red-50" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-0.5">
              {errors.email.message}
            </p>
          )}
        </div>
        {/* password  */}
        <div className="relative flex flex-col gap-1">
          <label className=" text-sm font-medium text-gray-700">
            Password:
          </label>
          <input
            type={showPassword ? "text" : "password"}
            disabled={isSubmitting}
            placeholder="@example.com"
            {...register("password")}
            className={` border rounded-lg text-sm px-4 py-2  outline-none transition focus:ring-2 focus:ring-amber-300 focus:border-transparent ${
              errors.password ? "border-red-400 bg-red-50" : "border-gray-300"
            }`}
          />
          <button
            className="absolute right-2 bottom-2 text-sm hover:cursor-pointer"
            type="button"
            onMouseEnter={() => setShowPassword(true)}
            onMouseLeave={() => setShowPassword(false)}
          >
            {showPassword ? <IoMdEye /> : <IoIosEyeOff />}
          </button>
          <button
            className="absolute  right-2 top-17  text-md font-medium text-amber-400 hover:underline hover:cursor-pointer"
            type="button"
            onClick={() => navigate("/auth/forget-pwd")}
          >
            Forgot password?
          </button>
          {errors.password && (
            <p className="text-red-500 text-xs mt-0.5">
              {errors.password.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 w-full py-2 text-black bg-amber-200 hover:bg-amber-200 disabled:cursor-not-allowed  font-semibold rounded-lg transition text-sm cursor-pointer"
        >
          {isSubmitting ? "logging..." : "login"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google  oauth */}

        <GoogleOAuth />

        <p className=" text-xs text-gray-500 text-center">
          By clicking Agree & Join or Continue, you agree to the LinkedIn User
          Agreement, Privacy Policy, and Cookie Policy.
        </p>
        <p className="text-center text-sm text-gray-500">
          New to AURA?{" "}
          <a
            href="/auth/register"
            className="text-amber-500 hover:underline font-medium"
          >
            create new account
          </a>
        </p>
      </form>
    </div>
  );
}
