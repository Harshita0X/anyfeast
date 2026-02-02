import { useState } from "react";
import CountryStep from "@/components/steps/CountryStep";
import GenderStep from "@/components/steps/GenderStep";
import BirthdayStep from "@/components/steps/BirthdayStep";
import MeasurementsStepNew from "@/components/steps/MeasurementsStepNew";
import ActivityLevelStep from "@/components/steps/ActivityLevelStep";
import GoalStepNew from "@/components/steps/GoalStepNew";
import DietPlanStep from "@/components/steps/DietPlanStep";
import SummaryStepNew from "@/components/steps/SummaryStepNew";
import { toast } from "sonner";

type Step = "country" | "gender" | "birthday" | "measurements" | "activity" | "goal" | "diet" | "summary";

interface OnboardingData {
  country: string;
  gender: string;
  birthday: { day: number; month: number; year: number };
  age: number;
  height: number;
  weight: number;
  activityLevel: string;
  activities: string[];
  goal: string;
  dietPlan: string;
  allergies: string[];
  dislikes: string[];
  cookingTime: string;
  monthlyBudget: string;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>("country");
  const [data, setData] = useState<OnboardingData>({
    country: "india",
    gender: "",
    birthday: { day: 1, month: 0, year: 1999 },
    age: 25,
    height: 170,
    weight: 70,
    activityLevel: "",
    activities: [],
    goal: "",
    dietPlan: "",
    allergies: [],
    dislikes: [],
    cookingTime: "30min",
    monthlyBudget: "standard",
  });

  const handleComplete = () => {
    toast.success("Your personalized plan has been created!", {
      description: "Welcome to your health journey with AnyFeast!",
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case "country":
        return (
          <CountryStep
            onNext={(country) => {
              setData({ ...data, country });
              setCurrentStep("gender");
            }}
            onBack={() => { }}
            initialCountry={data.country}
          />
        );

      case "gender":
        return (
          <GenderStep
            onNext={(gender) => {
              setData({ ...data, gender });
              setCurrentStep("birthday");
            }}
            onBack={() => setCurrentStep("country")}
            initialGender={data.gender}
          />
        );

      case "birthday":
        return (
          <BirthdayStep
            onNext={(birthday) => {
              const today = new Date();
              const birthDate = new Date(birthday.year, birthday.month, birthday.day);
              let age = today.getFullYear() - birthDate.getFullYear();
              const monthDiff = today.getMonth() - birthDate.getMonth();
              if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
              }
              setData({ ...data, birthday, age });
              setCurrentStep("measurements");
            }}
            onBack={() => setCurrentStep("gender")}
            initialBirthday={data.birthday}
          />
        );

      case "measurements":
        return (
          <MeasurementsStepNew
            onNext={(measurements) => {
              setData({ ...data, ...measurements });
              setCurrentStep("activity");
            }}
            onBack={() => setCurrentStep("birthday")}
            initialData={{ age: data.age, height: data.height, weight: data.weight }}
          />
        );

      case "activity":
        return (
          <ActivityLevelStep
            onNext={(activityData) => {
              setData({ ...data, activityLevel: activityData.level, activities: activityData.activities });
              setCurrentStep("goal");
            }}
            onBack={() => setCurrentStep("measurements")}
            initialData={{ level: data.activityLevel, activities: data.activities }}
          />
        );

      case "goal":
        return (
          <GoalStepNew
            onNext={(goal) => {
              setData({ ...data, goal });
              setCurrentStep("diet");
            }}
            onBack={() => setCurrentStep("activity")}
            initialGoal={data.goal}
          />
        );

      case "diet":
        return (
          <DietPlanStep
            onNext={(dietData) => {
              setData({ ...data, ...dietData });
              setCurrentStep("summary");
            }}
            onBack={() => setCurrentStep("goal")}
            initialData={{
              dietPlan: data.dietPlan,
              allergies: data.allergies,
              dislikes: data.dislikes,
              cookingTime: data.cookingTime,
              monthlyBudget: data.monthlyBudget
            }}
          />
        );

      case "summary":
        return (
          <SummaryStepNew
            data={data}
            onBack={() => setCurrentStep("diet")}
            onComplete={handleComplete}
          />
        );

      default:
        return null;
    }
  };

  return <>{renderStep()}</>;
};

export default Index;
