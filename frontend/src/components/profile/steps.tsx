import type { useForm } from "react-hook-form";
import type { StepFormData } from "../../pages/profile/schema";
import FormField from "../common/form-field";

interface StepProps {
  register: ReturnType<typeof useForm<StepFormData>>["register"];
  errors: Record<string, { message?: string }>;
}

export function PersonalInfo({ register, errors }: StepProps) {
  return (
    <div>
      <h1>Personal Information</h1>
      <FormField
        id="name"
        label="Name"
        register={register}
        errors={errors}
        type="text"
      />
      <FormField
        id="userName"
        label="userName"
        register={register}
        errors={errors}
        type="text"
      />
      {/* image upload under development */}
      <FormField
        id="avatar"
        label="Avatar"
        register={register}
        errors={errors}
        type="text"
      />
    </div>
  );
}

export function PersonalDetail({ register, errors }: StepProps) {
  return (
    <div>
      <h1>Personal Detail</h1>
      <FormField
        id="bio"
        label="Bio"
        register={register}
        errors={errors}
        type="text"
      />
      <FormField
        id="phoneNo"
        label="Contact"
        register={register}
        errors={errors}
        type="number"
      />

      <FormField
        id="location"
        label="Location"
        register={register}
        errors={errors}
        type="text"
      />
      <FormField
        id="DOB"
        label="Date of birth"
        register={register}
        errors={errors}
        type="text"
      />
      <FormField
        id="website"
        label="Website"
        register={register}
        errors={errors}
        type="text"
      />
    </div>
  );
}
