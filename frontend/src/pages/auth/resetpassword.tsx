import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { newPwdSchema, type newPwdData } from "./schema";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { resetPassword } from "../../store/auth";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { message } = useAppSelector((state) => state.auth);

  const token = searchParams.get("token") as string;

  const {
    register,
    setError,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<newPwdData>({
    resolver: zodResolver(newPwdSchema),
  });

  async function onSubmit(data: newPwdData) {
    try {
      await dispatch(
        resetPassword({ password: data.password, token: token }),
      ).unwrap();

      navigate("/auth/login");
      reset();
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
            <label>New Password</label>
            <input
              type="text"
              placeholder="Enter your new passwrd"
              {...register("password")}
              className={` border rounded-lg text-sm px-4 py-2  outline-none transition focus:ring-2 focus:ring-amber-300 focus:border-transparent ${
                errors.password ? "border-red-400 bg-red-50" : "border-gray-300"
              }`}
            />
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
            continue
          </button>
        </form>
        {message && <p className=" text-center font-md  mt-4">{message}</p>}
      </div>
    </div>
  );
}
