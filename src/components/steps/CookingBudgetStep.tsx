import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Wallet } from "lucide-react";
import OnboardingLayout from "@/components/layout/OnboardingLayout";
import ChatAvatar from "@/components/onboarding/ChatAvatar";
import TipBox from "@/components/onboarding/TipBox";
import SelectionCard from "@/components/onboarding/SelectionCard";
import ProgressDots from "@/components/onboarding/ProgressDots";
import DailyQuoteBox from "@/components/onboarding/DailyQuoteBox";
import gsap from "gsap";

interface CookingBudgetStepProps {
    onNext: (data: { cookingTime: string; monthlyBudget: string }) => void;
    onBack: () => void;
    initialData?: { cookingTime: string; monthlyBudget: string };
}

const cookingTimeOptions = [
    { id: "15min", name: "Quick", time: "15 min", icon: "⚡" },
    { id: "30min", name: "Medium", time: "30 min", icon: "🍳" },
    { id: "60min", name: "Gourmet", time: "1 hour+", icon: "👨‍🍳" },
];

const budgetOptions = [
    { id: "economy", name: "Economy", range: "₹5000 - ₹8000", icon: "🪙" },
    { id: "standard", name: "Standard", range: "₹9000 - ₹15000", icon: "💵" },
    { id: "premium", name: "Premium", range: "₹15000+", icon: "💎" },
];

const ChefAvatar = () => (
    <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-violet-400 rounded-full flex items-center justify-center text-5xl shadow-2xl border-4 border-white">
        👨‍🍳
    </div>
);

const CookingBudgetStep = ({ onNext, onBack, initialData }: CookingBudgetStepProps) => {
    const [cookingTime, setCookingTime] = useState(initialData?.cookingTime || "30min");
    const [budget, setBudget] = useState(initialData?.monthlyBudget || "standard");

    const containerRef = useRef<HTMLDivElement>(null);
    const avatarRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();
            tl.from(containerRef.current, { opacity: 0, scale: 0.9, duration: 0.8 });
            tl.from(avatarRef.current, { y: -50, opacity: 0, duration: 0.6, ease: "back.out" }, 0.4);
            tl.from(titleRef.current, { y: 20, opacity: 0, duration: 0.5 }, 0.6);
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const handleNext = () => {
        onNext({ cookingTime, monthlyBudget: budget });
    };

    return (
        <OnboardingLayout>
            <DailyQuoteBox />
            <div ref={containerRef} className="h-full w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-50 flex items-center justify-center">
                <div className="max-w-5xl w-full px-12 py-10 relative z-10 flex flex-col items-center">
                    <div ref={avatarRef} className="mb-6"><ChefAvatar /></div>
                    <TipBox>✨ Let's tailor the meals to fit your schedule and wallet!</TipBox>
                    <h2 ref={titleRef} className="text-4xl font-black text-white mt-8 mb-12 text-center">Time & Budget Preferences</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full mb-12">
                        {/* Cooking Time */}
                        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border-2 border-white/20">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Clock /> Cooking Time (per meal)</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {cookingTimeOptions.map(opt => (
                                    <SelectionCard
                                        key={opt.id}
                                        selected={cookingTime === opt.id}
                                        onClick={() => setCookingTime(opt.id)}
                                        className="p-6 cursor-pointer flex items-center justify-between"
                                        style={{ background: cookingTime === opt.id ? 'white' : 'rgba(255,255,255,0.05)' }}
                                    >
                                        <div className="flex items-center gap-4 text-left">
                                            <span className="text-4xl">{opt.icon}</span>
                                            <div>
                                                <p className={`font-black text-lg ${cookingTime === opt.id ? 'text-indigo-600' : 'text-white'}`}>{opt.name}</p>
                                                <p className={`text-sm ${cookingTime === opt.id ? 'text-indigo-400' : 'text-indigo-100'}`}>{opt.time}</p>
                                            </div>
                                        </div>
                                    </SelectionCard>
                                ))}
                            </div>
                        </div>

                        {/* Budget */}
                        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border-2 border-white/20">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Wallet /> Monthly Budget</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {budgetOptions.map(opt => (
                                    <SelectionCard
                                        key={opt.id}
                                        selected={budget === opt.id}
                                        onClick={() => setBudget(opt.id)}
                                        className="p-6 cursor-pointer flex items-center justify-between"
                                        style={{ background: budget === opt.id ? 'white' : 'rgba(255,255,255,0.05)' }}
                                    >
                                        <div className="flex items-center gap-4 text-left">
                                            <span className="text-4xl">{opt.icon}</span>
                                            <div>
                                                <p className={`font-black text-lg ${budget === opt.id ? 'text-indigo-600' : 'text-white'}`}>{opt.name}</p>
                                                <p className={`text-sm ${budget === opt.id ? 'text-indigo-400' : 'text-indigo-100'}`}>{opt.range}</p>
                                            </div>
                                        </div>
                                    </SelectionCard>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between w-full">
                        <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/20 font-bold border-2 border-white">
                            <ArrowLeft className="mr-2" /> Back
                        </Button>
                        <ProgressDots currentStep={9} totalSteps={10} />
                        <Button onClick={handleNext} className="bg-white text-indigo-600 hover:bg-indigo-50 font-black px-12 py-6 text-xl rounded-2xl shadow-xl">
                            Show My Summary
                        </Button>
                    </div>
                </div>
            </div>
        </OnboardingLayout>
    );
};

export default CookingBudgetStep;
