import { useState } from "react";
import {
  personalDetailSchema,
  personalInfoSchema,
} from "../pages/profile/schema";
import { type StepFormData } from "../pages/profile/schema";
import { FaUserCircle } from "react-icons/fa";

const stepSchema = [personalInfoSchema, personalDetailSchema];

export const steps = [
  { id: "personal_I", name: "personal info", icon: <FaUserCircle /> },
  { id: "personal_D", name: "personal detail", icon: "" },
];

export function useMultiStepForm() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isSubnitted, setIsSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<StepFormData>>({});

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  // return step from current step
  const getCurrentStepSchema = () => stepSchema[currentStep];

  // go to next step
  const goToNextStep = () => {
    if (!isLastStep) setCurrentStep((prev) => prev + 1);
  };
  // go to prev step
  const goToPreviousStep = () => {
    if (!isFirstStep) setCurrentStep((prev) => prev - 1);
  };

  //merge and update form data
  const updateFormData = (newData: Partial<StepFormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  //handle subbmit
  const submitForm = () => {
    setIsSubmitted(true);
  };

  // handle reset
  const resetForm = () => {
    setCurrentStep(0);
    setFormData({});
    setIsSubmitted(false);
  };

  return {
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
  };
}
