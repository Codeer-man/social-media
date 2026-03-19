import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createProfileSchema, type createProfileSchemaData } from "./schema";

export default function CreateProfile() {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<createProfileSchemaData>({
    resolver: zodResolver(createProfileSchema),
  });

  return <div></div>;
}
