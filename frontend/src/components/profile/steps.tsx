import FormField from "../common/form-field";
import type { useForm } from "react-hook-form";
import type { StepFormData } from "../../pages/profile/schema";

interface setProps {
  errors: Record<string, { message?: string }>;
  register: ReturnType<typeof useForm<StepFormData>>["register"];
  setValue?: ReturnType<typeof useForm<StepFormData>>["setValue"];
}

export function PersonalInfo({ errors, register }: setProps) {
  return (
    <div className="space-y-4 mt-5">
      <h3 className=" text-3xl">Personal Information</h3>

      <div className=" flex flex-col mt-2 ml-2">
        <label className="text-sm font-medium text-gray-700">name</label>
        <input
          className={`px-4 py-2.5 border rounded-lg text-sm outline-none transition focus:ring-2 focus:ring-amber-300 focus:border-transparent ${
            errors.name ? "border-red-400 bg-red-50" : "border-gray-300"
          }`}
          type="text"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-0.5">{errors.name.message}</p>
        )}
      </div>

      {/* 
      <FormField
        errors={errors}
        register={register}
        label="Name:"
        type="text"
        id="name"
      />
      <FormField
        errors={errors}
        register={register}
        type="text"
        label="UserName:"
        id="userName"
      />
     
      <FormField
        errors={errors}
        register={register}
        label="Image:"
        id="avatar"
      />
       */}
    </div>
  );
}

export function PersonalDetail({ errors, register }: setProps) {
  return (
    <div className="space-y-4 mt-5">
      <h3 className=" text-3xl ">Personal Detail</h3>
      <div className="">
        <FormField
          errors={errors}
          register={register}
          label="Bio:"
          type="text"
          id="bio"
        />
        <FormField
          errors={errors}
          register={register}
          type="text"
          label="Phone Number:"
          id="phoneNo"
        />
        <div className=" grid grid-cols-2 gap-4">
          <FormField
            errors={errors}
            register={register}
            label="Location:"
            type="text"
            id="location"
          />
          <FormField
            errors={errors}
            register={register}
            label="DOB:"
            type="Date"
            id="DOB"
          />
        </div>

        <FormField
          errors={errors}
          register={register}
          label="Website:"
          type="text"
          id="website"
        />
      </div>
    </div>
  );
}
