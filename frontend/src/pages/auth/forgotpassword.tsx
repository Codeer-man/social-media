import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { forgetPwdSchema, type forgetPwdData } from "./schema";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { forgetPassword } from "../../store/auth";

export default function ForgotPassword() {
  const dispatch = useAppDispatch();
  const { message } = useAppSelector((state) => state.auth);

  const {
    register,
    setError,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<forgetPwdData>({
    resolver: zodResolver(forgetPwdSchema),
  });

  async function onSubmit(data: forgetPwdData) {
    try {
      await dispatch(forgetPassword(data)).unwrap();
    } catch (error: any) {
      setError("root", {
        type: "server",
        message: error,
      });
    }
  }

  return (
    <div className="h-screen w-screen bg-zinc-200  flex items-center justify-center">
      <div className="flex flex-col items-center w-full max-w-md rounded-2xl shadow-[0_0_25px_4px_rgba(0,0,0,0.08)] px-8 py-6 ">
        {errors.root && (
          <div className="  p-3 border rounded-lg border-red-200 mb-4  w-full text-center bg-red-50">
            <p className=" text-red-600 font-medium text-sm">
              {errors.root.message}
            </p>
          </div>
        )}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=" flex flex-col w-full"
        >
          <div className=" flex flex-col gap-3">
            <label>Enter your email</label>
            <input
              type="text"
              placeholder="Enter your email"
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
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 w-full py-2 text-black bg-amber-200 hover:bg-amber-200 disabled:cursor-not-allowed  font-semibold rounded-lg transition text-sm cursor-pointer"
          >
            continue
          </button>
        </form>
        {message && <p className=" text-center font-md  mt-4">{message}</p>}
      </div>
    </div>
  );
}
