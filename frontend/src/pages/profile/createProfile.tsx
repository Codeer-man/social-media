import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type StepFormData } from "./schema";
import { useMultiStepForm } from "../../hooks/use-multi-step-hook";
import { useEffect } from "react";
import { FaHouseUser } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import ProgessStep from "../../components/profile/progessStep";
import { PersonalDetail, PersonalInfo } from "../../components/profile/steps";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

export default function CreateProfile() {
  // custom hook
  const {
    formData,
    currentStep,
    isLastStep,
    isFirstStep,
    isSubnitted,
    steps,

    // function or methods
    getCurrentStepSchema,
    goToPreviousStep,
    goToNextStep,
    updateFormData,
    submitForm,
    resetForm,
  } = useMultiStepForm();

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<StepFormData>({
    resolver: zodResolver(getCurrentStepSchema()) as any,
  });

  //to bring old data
  useEffect(() => {
    reset(formData);
  }, [currentStep, formData, reset]);

  async function onNext(data: StepFormData) {
    console.log(data, "data");
    if (isLastStep) {
      submitForm({ ...formData, ...data } as StepFormData);
    } else {
      goToNextStep();
    }
  }
  console.log(currentStep, "step");
  console.log(errors, "erros");
  return (
    <div className=" h-150 w-180 rounded-lg shadow-[0_0_25px_4px_rgba(0,0,0,0.08)] px-10 py-10  font-[inter]">
      {/*  info */}
      <div className=" flex gap-50 item-center px-5">
        <div className=" border rounded-full bg-gray-400 h-15 w-15 border-none flex items-center justify-center">
          <FaRegUser size={35} />
        </div>
        <div className=" border rounded-full bg-gray-400 h-15 w-15 border-none flex items-center justify-center">
          <FaHouseUser size={35} />
        </div>
      </div>
      <ProgessStep currentStep={currentStep} steps={steps} />
      <div className="flex  gap-33 mt-3 font-medium tracking-wide text-xl">
        <p>Personal Info</p>
        <p>Personal Detail</p>
      </div>

      {/* form  data */}
      <form key={currentStep} onSubmit={handleSubmit(onNext)}>
        {/* content */}
        <div>
          {/* {currentStep === 0 && (
            <PersonalInfo errors={errors} register={register} />
          )} */}

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              className={`px-4 py-2.5 border rounded-lg text-sm outline-none transition focus:ring-2 focus:ring-amber-300 focus:border-transparent ${
                errors.name ? "border-red-400 bg-red-50" : "border-gray-300"
              }`}
              type="text"
              placeholder="you@example.com"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-0.5">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              userName
            </label>
            <input
              className={`px-4 py-2.5 border rounded-lg text-sm outline-none transition focus:ring-2 focus:ring-amber-300 focus:border-transparent ${
                errors.userName ? "border-red-400 bg-red-50" : "border-gray-300"
              }`}
              type="text"
              placeholder="you@example.com"
              {...register("userName")}
            />
            {errors.userName && (
              <p className="text-red-500 text-xs mt-0.5">
                {errors.userName.message}
              </p>
            )}
          </div>

          {currentStep === 1 && (
            <PersonalDetail errors={errors} register={register} />
          )}
        </div>

        {/* step button  */}
        <div className=" flex items-center justify-between pt-3 mt-4">
          <button
            type="button"
            onClick={goToPreviousStep}
            disabled={isFirstStep}
            className="flex items-center gap-1 border-2 rounded-md px-2 py-1 cursor-pointer hover:bg-gray-200"
          >
            <BiChevronLeft size={25} /> Prev
          </button>
          <button className="flex items-center gap-1 border-2 rounded-md px-2 py-2 cursor-pointer bg-zinc-800 text-white">
            {isLastStep ? "Submit" : "Next"}
            {!isLastStep && <BiChevronRight size={25} />}
          </button>
        </div>
      </form>
    </div>
  );
}
