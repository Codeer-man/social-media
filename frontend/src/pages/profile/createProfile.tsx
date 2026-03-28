import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type StepFormData } from "./schema";
import { useMultiStepForm } from "../../hooks/use-multi-step-hook";
import { FaHouseUser } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import ProgessStep from "../../components/profile/progessStep";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { PersonalDetail, PersonalInfo } from "../../components/profile/Steps";

export default function CreateProfile() {
  // custom hook
  const {
    formData,
    currentStep,
    isLastStep,
    isFirstStep,
    // isSubnitted,
    steps,

    // function or methods
    getCurrentStepSchema,
    goToPreviousStep,
    goToNextStep,
    updateFormData,
    submitForm,
    // resetForm,
  } = useMultiStepForm();

  const fullSchema = getCurrentStepSchema();
  const {
    register,
    handleSubmit,
    setError,
    trigger,
    formState: { errors },
  } = useForm<StepFormData>({
    resolver: zodResolver(fullSchema),
    mode: "onChange",
    defaultValues: formData,
    shouldUnregister: false,
  });

  //to bring old data
  //! not working and is bringin bug of no ref in input
  // useEffect(() => {
  //   reset(formData);
  // }, [currentStep, formData, reset]);

  //handle submit
  async function onNext(data: StepFormData) {
    const isValid = await trigger();
    if (!isValid) return; // Stop if validation fails

    const updatedData = { ...formData, ...data };
    updateFormData(updatedData);

    if (isLastStep) {
      try {
        submitForm(updatedData);
      } catch (error: any) {
        setError("root", {
          type: "server",
          message: error,
        });
      }
    } else {
      goToNextStep();
    }
  }

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
      {/* form  */}
      <form onSubmit={handleSubmit(onNext)}>
        <div>
          {currentStep === 0 && (
            <PersonalInfo register={register} errors={errors} />
          )}
          {currentStep === 1 && (
            <PersonalDetail register={register} errors={errors} />
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
