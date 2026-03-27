import type { IconType } from "react-icons";
import z from "zod";

export const personalInfoSchema = z.object({
  name: z.string("name is requried").min(3, "Must be 3 character long"),
  userName: z.string().min(3).nonempty(),
  avatar: z.string().optional(),
});

export const personalDetailSchema = z.object({
  bio: z.string().optional(),
  phoneNo: z.string().optional(),
  location: z.string().optional(),
  DOB: z.string().optional(),
  website: z.string().optional(),
});

export type personalInfo = z.infer<typeof personalInfoSchema>;
export type personalDetail = z.infer<typeof personalDetailSchema>;

export type StepFormData = personalInfo | personalDetail;
export type AllFormField = personalInfo & personalDetail;

// export type StepFormData = personalInfo & personalDetail;
// export type AllFormField = StepFormData;

export interface Steps {
  id: string;
  name: string;
  // icon: React.ComponentType<{ className?: string }>;
  icon: IconType;
}

// {steps.map((step) => {
//   const Icon = step.icon; // Capitalize to use as a component
//   return <Icon key={step.id} size={24} />;
// })}
