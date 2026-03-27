import type { AllFormField, StepFormData } from "../../pages/profile/schema";
import type { useForm } from "react-hook-form";

export default function FormField({
  id,
  label,
  register,
  errors,
  type = "text",
}: {
  id: keyof AllFormField;
  label: string;
  register: ReturnType<typeof useForm<StepFormData>>["register"];
  errors: Record<string, { message?: string }>;
  type?: string;
}) {
  return (
    <div className=" space-y-4">
      <div className=" flex flex-col mt-2 ml-2">
        <label className="text-sm font-medium text-gray-700" htmlFor={id}>
          {label}{" "}
        </label>
        <input
          className={`px-4 py-2.5 border rounded-lg text-sm outline-none transition focus:ring-2 focus:ring-amber-300 focus:border-transparent ${
            errors[id] ? "border-red-400 bg-red-50" : "border-gray-300"
          }`}
          type={type}
          id={id}
          {...register(id)}
        />
        {errors[id] && (
          <p className="text-red-500 text-xs mt-0.5">{errors[id].message}</p>
        )}
      </div>
    </div>
  );
}
