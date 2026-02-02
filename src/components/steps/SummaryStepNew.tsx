import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Sparkles,
  Flame,
  TrendingUp,
  Target,
  Calendar,
  Check
} from "lucide-react";
import OnboardingLayout from "@/components/layout/OnboardingLayout";
import DailyQuoteBox from "@/components/onboarding/DailyQuoteBox";
import ChatAvatar from "@/components/onboarding/ChatAvatar";
import TipBox from "@/components/onboarding/TipBox";
import ProgressDots from "@/components/onboarding/ProgressDots";
import gsap from "gsap";

interface SummaryStepProps {
  data: {
    country: string;
    gender: string;
    age: number;
    height: number;
    weight: number;
    goal: string;
    activityLevel: string;
    dietPlan: string;
    monthlyBudget: string;
    cookingTime: string;
    allergies: string[];
    dislikes: string[];
  };
  onBack: () => void;
  onComplete: () => void;
}

const activityMultipliers: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  intense: 1.725,
};

const goalLabels: Record<string, string> = {
  "weight-loss": "Weight Loss",
  "muscle-gain": "Build Muscle",
  maintain: "Stay Fit",
  lifestyle: "Better Lifestyle",
};

const activityLabels: Record<string, string> = {
  sedentary: "Sedentary",
  light: "Light",
  moderate: "Moderate",
  intense: "Intense",
};

const SparkleAvatar = () => (
  <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-5xl shadow-2xl border-4 border-white">
    ✨
  </div>
);

const SummaryStepNew = ({ data, onBack, onComplete }: SummaryStepProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const statCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const preferencesRef = useRef<HTMLDivElement>(null);
  const confettiRefs = useRef<(HTMLDivElement | null)[]>([]);

  // BMR Calculation (Mifflin-St Jeor)
  const bmr = Math.round(
    data.gender === "male"
      ? 10 * data.weight + 6.25 * data.height - 5 * data.age + 5
      : 10 * data.weight + 6.25 * data.height - 5 * data.age - 161
  );

  // TDEE Calculation
  const multiplier = activityMultipliers[data.activityLevel] || 1.2;
  const tdee = Math.round(bmr * multiplier);

  // Weight Goal Simulation (assuming target is +/- 5kg based on goal)
  const weightChange = data.goal === "weight-loss" ? -5 : data.goal === "muscle-gain" ? 5 : 0;
  const targetWeight = data.weight + weightChange;
  const weeksToGoal = Math.abs(weightChange) * 2; // Assuming 0.5kg per week
  const monthsToGoal = Math.round(weeksToGoal / 4.3);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(containerRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });

      tl.from(avatarRef.current, {
        scale: 0,
        rotation: 360,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
      }, 0.2);

      tl.from(tipRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.5
      }, 0.4);

      tl.from(titleRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.5
      }, 0.5);

      tl.from(statCardRefs.current, {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "back.out(1.5)"
      }, 0.6);

      tl.from(preferencesRef.current, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }, 1.0);

      // Confetti floating
      confettiRefs.current.forEach((confetti, i) => {
        if (confetti) {
          gsap.to(confetti, {
            y: "random(-20, 20)",
            x: "random(-20, 20)",
            rotation: "random(-90, 90)",
            duration: "random(2, 4)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.1
          });
        }
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <OnboardingLayout>
      <DailyQuoteBox />
      <div
        ref={containerRef}
        className="relative h-full w-full flex items-center justify-center overflow-y-auto bg-slate-50 py-12"
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              ref={(el) => (confettiRefs.current[i] = el)}
              className="absolute w-2 h-2 rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ['#fbbf24', '#f97316', '#3b82f6', '#10b981'][i % 4]
              }}
            />
          ))}
        </div>

        <div className="relative z-10 w-full max-w-5xl px-6">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div ref={avatarRef} className="inline-block mb-4">
              <SparkleAvatar />
            </div>
            <div ref={tipRef}>
              <TipBox>
                🎉 Great job! We've analyzed your bio-data to craft your perfect journey.
              </TipBox>
            </div>
            <h2 ref={titleRef} className="text-4xl font-black text-slate-800 mt-8">
              Your Health Summary
            </h2>
          </div>

          {/* Core Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* BMR Card */}
            <div
              ref={(el) => (statCardRefs.current[0] = el)}
              className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex items-center gap-6"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                <Flame className="w-8 h-8 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Basal Metabolic Rate</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-800">{bmr}</span>
                  <span className="text-slate-400 font-bold text-lg">kcal/day</span>
                </div>
              </div>
            </div>

            {/* TDEE Card */}
            <div
              ref={(el) => (statCardRefs.current[1] = el)}
              className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex items-center gap-6"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Daily Energy Expenditure</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-800">{tdee}</span>
                  <span className="text-slate-400 font-bold text-lg">kcal/day</span>
                </div>
              </div>
            </div>

            {/* Weight Goal Card */}
            <div
              ref={(el) => (statCardRefs.current[2] = el)}
              className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex items-center gap-6"
            >
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                <Target className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Weight Goal</p>
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-black text-slate-800">{data.weight} → {targetWeight} kg</span>
                </div>
                <p className="text-green-600 font-bold mt-1">
                  {weightChange === 0 ? "Maintain Weight" : `${weightChange > 0 ? "Gain" : "Lose"} ${Math.abs(weightChange)} kg`}
                </p>
              </div>
            </div>

            {/* Estimated Time Card */}
            <div
              ref={(el) => (statCardRefs.current[3] = el)}
              className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex items-center gap-6"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                <Calendar className="w-8 h-8 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Estimated Time to Goal</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-800">{weeksToGoal}</span>
                  <span className="text-slate-400 font-bold text-lg">weeks (~{monthsToGoal} months)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div
            ref={preferencesRef}
            className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100 mb-12"
          >
            <h3 className="text-2xl font-black text-slate-800 mb-8 pb-4 border-b border-slate-100">
              Your Preferences
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
              <div className="flex flex-col gap-1">
                <p className="text-slate-400 font-bold uppercase tracking-wider text-xs">Activity Level</p>
                <p className="text-slate-800 font-black text-xl">{activityLabels[data.activityLevel] || "Not selected"}</p>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-slate-400 font-bold uppercase tracking-wider text-xs">Diet Plan</p>
                <p className="text-slate-800 font-black text-xl capitalize">{data.dietPlan.replace('-', ' ') || "Standard"}</p>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-slate-400 font-bold uppercase tracking-wider text-xs">Monthly Budget</p>
                <p className="text-slate-800 font-black text-xl capitalize">{data.monthlyBudget}</p>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-slate-400 font-bold uppercase tracking-wider text-xs">Cooking Time</p>
                <p className="text-slate-800 font-black text-xl">{data.cookingTime === "60min" ? "1h+" : data.cookingTime.replace("min", "m")}</p>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-slate-400 font-bold uppercase tracking-wider text-xs">Allergies</p>
                <p className="text-slate-800 font-black text-xl capitalize">{data.allergies.length > 0 ? data.allergies.join(", ") : "None reported"}</p>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-slate-400 font-bold uppercase tracking-wider text-xs">Dislikes</p>
                <p className="text-slate-800 font-black text-xl capitalize">{data.dislikes.length > 0 ? data.dislikes.join(", ") : "None"}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              className="gap-3 text-xl px-8 py-8 h-auto bg-white hover:bg-slate-50 transition-all text-slate-600 font-bold rounded-2xl border border-slate-200"
            >
              <ArrowLeft className="w-6 h-6" />
              Back
            </Button>

            <ProgressDots currentStep={8} totalSteps={8} />

            <Button
              variant="default"
              onClick={onComplete}
              className="gap-3 text-xl px-16 py-8 h-auto bg-slate-900 hover:bg-black transition-all text-white font-black rounded-2xl shadow-2xl"
            >
              Create My Plan
              <Check className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default SummaryStepNew;
