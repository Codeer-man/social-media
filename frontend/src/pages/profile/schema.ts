import type { IconType } from "react-icons";
import z from "zod";

export const personalInfoSchema = z.object({
  name: z.string().min(3, "name is reqruied"),
  userName: z.string().min(3, "userName is required"),
  avatar: z.string().optional(),
});

export const personalDetailSchema = z.object({
  bio: z.string().optional(),
  phoneNo: z.string().optional(),
  location: z.string().optional(),
  DOB: z.string().optional(),
  website: z.string().optional(),
});

export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type PersonalDetail = z.infer<typeof personalDetailSchema>;

export type StepFormData = PersonalInfo | PersonalDetail;
export type AllFormField = PersonalInfo & PersonalDetail;

export interface Steps {
  id: string;
  name: string;
  icon: IconType;
}
