import { useForm } from "react-hook-form";
import { registerSchema, type registerFormData } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "../../store/auth";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hook";
import { useState } from "react";
import { IoIosEyeOff, IoMdEye } from "react-icons/io";

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<registerFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: registerFormData) {
    try {
      await dispatch(registerUser(data)).unwrap();

      reset();
      navigate("/auth/create");
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
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 font-medium text-sm">
            {errors.root.message}
          </p>
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-800 mb-1">
        Create an account
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        Fill in the details below to get started
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            className={`px-4 py-2.5 border rounded-lg text-sm outline-none transition focus:ring-2 focus:ring-amber-300 focus:border-transparent ${
              errors.email ? "border-red-400 bg-red-50" : "border-gray-300"
            }`}
            type="text"
            placeholder="you@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-0.5">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className=" relative flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            className={`px-4 py-2.5 border rounded-lg text-sm outline-none transition focus:ring-2 focus:ring-amber-300 focus:border-transparent ${
              errors.password ? "border-red-400 bg-red-50" : "border-gray-300"
            }`}
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            {...register("password")}
          />
          <button
            className=" absolute right-2 bottom-2 text-sm"
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <IoMdEye /> : <IoIosEyeOff />}
          </button>
          {errors.password && (
            <p className="text-red-500 text-xs mt-0.5">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className=" relative flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            className={`px-4 py-2.5 border rounded-lg text-sm outline-none transition focus:ring-2 focus:ring-amber-300 focus:border-transparent ${
              errors.confirmPassword
                ? "border-red-400 bg-red-50"
                : "border-gray-300"
            }`}
            type={showPassword ? "text" : "password"}
            placeholder="Re-enter your password"
            {...register("confirmPassword")}
          />
          <button
            className="absolute right-2 bottom-2 text-sm"
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <IoMdEye /> : <IoIosEyeOff />}
          </button>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-0.5">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full py-2.5 text-black bg-amber-200 hover:bg-amber-300 disabled:bg-amber-100 disabled:cursor-not-allowed  font-semibold rounded-lg transition text-sm cursor-pointer"
        >
          {isSubmitting ? "Registering..." : "Create Account"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={() => {
            /* your google auth handler */
          }}
          className="w-full flex items-center justify-center gap-3 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-700 cursor-pointer"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>
        <p className=" text-xs text-gray-500 text-center">
          By clicking Agree & Join or Continue, you agree to the LinkedIn User
          Agreement, Privacy Policy, and Cookie Policy.
        </p>
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a
            href="/auth/login"
            className="text-amber-500 hover:underline font-medium"
          >
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
}
