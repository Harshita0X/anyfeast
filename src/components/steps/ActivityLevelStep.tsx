import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, X } from "lucide-react";
import OnboardingLayout from "@/components/layout/OnboardingLayout";
import ChatAvatar from "@/components/onboarding/ChatAvatar";
import TipBox from "@/components/onboarding/TipBox";
import SelectionCard from "@/components/onboarding/SelectionCard";
import ProgressDots from "@/components/onboarding/ProgressDots";
import DailyQuoteBox from "@/components/onboarding/DailyQuoteBox";
import gsap from "gsap";

interface ActivityLevelStepProps {
    onNext: (data: { level: string; activities: string[] }) => void;
    onBack: () => void;
    initialData?: { level: string; activities: string[] };
}

const activityLevels = [
    { id: "sedentary", name: "Sedentary", description: "Little or no exercise", multiplier: "1.2x", icon: "🛋️", color: "from-gray-100 to-slate-50" },
    { id: "light", name: "Light", description: "1-3 days/week", multiplier: "1.375x", icon: "🚶", color: "from-blue-100 to-cyan-50" },
    { id: "moderate", name: "Moderate", description: "3-5 days/week", multiplier: "1.55x", icon: "🏃", color: "from-green-100 to-emerald-50" },
    { id: "intense", name: "Intense", description: "6-7 days/week", multiplier: "1.725x", icon: "💪", color: "from-orange-100 to-red-50" },
];

const activities = [
    { id: "running", name: "Running", icon: "🏃‍♂️" },
    { id: "swimming", name: "Swimming", icon: "🏊" },
    { id: "cycling", name: "Cycling", icon: "🚴" },
    { id: "yoga", name: "Yoga", icon: "🧘" },
    { id: "weight-training", name: "Weight Training", icon: "🏋️" },
    { id: "dancing", name: "Dancing", icon: "💃" },
    { id: "sports", name: "Sports", icon: "⚽" },
    { id: "walking", name: "Walking", icon: "🚶‍♀️" },
    { id: "other", name: "Other", icon: "🎯" },
];

const FitnessAvatar = () => (
    <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center text-5xl shadow-2xl border-4 border-white">
        🏃‍♂️
    </div>
);

const ActivityLevelStep = ({ onNext, onBack, initialData }: ActivityLevelStepProps) => {
    const [selectedLevel, setSelectedLevel] = useState(initialData?.level || "");
    const [selectedActivities, setSelectedActivities] = useState<string[]>(initialData?.activities || []);

    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const avatarRef = useRef<HTMLDivElement>(null);
    const tipRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const levelCardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const activityCardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [customActivities, setCustomActivities] = useState<string[]>([]);
    const [showInput, setShowInput] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const allActivities = [
        ...activities,
        ...customActivities.map(a => ({ id: a, name: a, icon: "✨" }))
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            tl.from(containerRef.current, {
                opacity: 0,
                scale: 0.95,
                duration: 0.8,
                ease: "power3.out"
            });

            tl.from(avatarRef.current, {
                scale: 0,
                y: -100,
                rotation: 360,
                opacity: 0,
                duration: 0.9,
                ease: "bounce.out"
            }, 0.3);

            tl.from(tipRef.current, {
                x: -200,
                opacity: 0,
                duration: 0.6,
                ease: "power3.out"
            }, 0.6);

            tl.from(titleRef.current, {
                scale: 0,
                opacity: 0,
                duration: 0.6,
                ease: "back.out(2)"
            }, 0.9);

            tl.from(levelCardRefs.current, {
                y: 50,
                opacity: 0,
                scale: 0.8,
                stagger: 0.1,
                duration: 0.5,
                ease: "back.out(1.7)"
            }, 1.2);

            tl.from(activityCardRefs.current, {
                y: 50,
                opacity: 0,
                scale: 0.8,
                stagger: 0.05,
                duration: 0.4,
                ease: "back.out(1.7)"
            }, 1.5);

            // Floating avatar
            gsap.to(avatarRef.current, {
                y: -10,
                duration: 2.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const toggleActivity = (activityId: string) => {
        setSelectedActivities(prev =>
            prev.includes(activityId)
                ? prev.filter(id => id !== activityId)
                : [...prev, activityId]
        );
    };

    const handleContinue = () => {
        if (!selectedLevel) return;

        const tl = gsap.timeline({
            onComplete: () => onNext({ level: selectedLevel, activities: selectedActivities })
        });

        tl.to(contentRef.current, {
            scale: 0.9,
            opacity: 0,
            duration: 0.5,
            ease: "power2.in"
        });
    };

    return (
        <OnboardingLayout>
            <DailyQuoteBox />
            <div
                ref={containerRef}
                className="relative h-full w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-300 via-blue-200 to-green-50"
            >
                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl" />
                </div>

                {/* Main content */}
                <div
                    ref={contentRef}
                    className="relative z-10 w-full h-full flex flex-col justify-center px-12 py-6 overflow-y-auto"
                >
                    {/* Chat Avatar */}
                    <div ref={avatarRef} className="mb-6 flex justify-center">
                        <ChatAvatar
                            avatar={<FitnessAvatar />}
                            message="How active are you?"
                        />
                    </div>

                    {/* Tip Box */}
                    <div ref={tipRef} className="mb-8 max-w-4xl mx-auto">
                        <TipBox>
                            💡 Your activity level helps us calculate your daily calorie needs!
                        </TipBox>
                    </div>

                    {/* Title */}
                    <h2
                        ref={titleRef}
                        className="text-center text-4xl font-black text-white mb-8 drop-shadow-lg"
                    >
                        Select your activity level
                    </h2>

                    {/* Activity Level Cards */}
                    <div className="grid grid-cols-4 gap-6 mb-10 max-w-6xl mx-auto w-full" style={{ gridAutoRows: '1fr' }}>
                        {activityLevels.map((level, index) => (
                            <div
                                key={level.id}
                                ref={(el) => (levelCardRefs.current[index] = el)}
                            >
                                <SelectionCard
                                    selected={selectedLevel === level.id}
                                    onClick={() => setSelectedLevel(level.id)}
                                    className={`relative overflow-hidden w-full transition-all duration-300 cursor-pointer ${selectedLevel === level.id
                                        ? 'ring-4 ring-blue-500 shadow-2xl'
                                        : 'ring-0'
                                        }`}
                                    style={{
                                        height: '180px',
                                        borderRadius: '24px',
                                        background: selectedLevel === level.id
                                            ? 'linear-gradient(135deg, #3b82f6, #06b6d4)'
                                            : 'linear-gradient(135deg, white, #f0f9ff)'
                                    }}
                                >
                                    <div className="relative z-10 h-full flex flex-col items-center justify-center">
                                        <span className="text-5xl block mb-3">{level.icon}</span>
                                        <p className={`font-black text-xl mb-2 ${selectedLevel === level.id ? 'text-white' : 'text-gray-800'
                                            }`}>
                                            {level.name}
                                        </p>
                                        <p className={`text-sm mb-1 ${selectedLevel === level.id ? 'text-blue-100' : 'text-gray-600'
                                            }`}>
                                            {level.description}
                                        </p>
                                        <p className={`text-lg font-black ${selectedLevel === level.id ? 'text-cyan-200' : 'text-blue-600'
                                            }`}>
                                            {level.multiplier}
                                        </p>
                                    </div>
                                </SelectionCard>
                            </div>
                        ))}
                    </div>

                    {/* Activities Section - Only show when activity level is selected */}
                    {selectedLevel && (
                        <div className="max-w-6xl mx-auto w-full mb-10">
                            <h3 className="text-center text-3xl font-black text-white mb-8 drop-shadow-lg">
                                What's your main activity? (Select all that apply)
                            </h3>
                            <div className="grid grid-cols-3 gap-6" style={{ gridAutoRows: '1fr' }}>
                                {allActivities.map((activity, index) => (
                                    <div
                                        key={activity.id}
                                        ref={(el) => (activityCardRefs.current[index] = el)}
                                    >
                                        <SelectionCard
                                            selected={selectedActivities.includes(activity.id)}
                                            onClick={() => toggleActivity(activity.id)}
                                            className={`relative overflow-hidden w-full transition-all duration-300 cursor-pointer ${selectedActivities.includes(activity.id)
                                                ? 'ring-4 ring-green-500 shadow-xl'
                                                : 'ring-0'
                                                }`}
                                            style={{
                                                height: '160px',
                                                borderRadius: '24px',
                                                background: selectedActivities.includes(activity.id)
                                                    ? 'linear-gradient(135deg, #10b981, #14b8a6)'
                                                    : 'linear-gradient(135deg, white, #f0fdf4)'
                                            }}
                                        >
                                            <div className="relative z-10 h-full flex flex-col items-center justify-center">
                                                <span className="text-5xl block mb-3">{activity.icon}</span>
                                                <p className={`font-black text-lg ${selectedActivities.includes(activity.id) ? 'text-white' : 'text-gray-800'
                                                    }`}>
                                                    {activity.name}
                                                </p>
                                            </div>
                                        </SelectionCard>
                                    </div>
                                ))}



                            </div>

                        </div>
                    )}

                    {/* Progress & Navigation */}
                    <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
                        <Button
                            variant="ghost"
                            onClick={onBack}
                            className="gap-3 text-xl px-8 py-8 bg-white/90 hover:bg-white hover:scale-105 transition-all text-blue-600 font-bold"
                        >
                            <ArrowLeft className="w-6 h-6" />
                            Back
                        </Button>

                        <ProgressDots currentStep={5} totalSteps={8} />

                        <Button
                            variant="default"
                            onClick={handleContinue}
                            disabled={!selectedLevel}
                            className="text-xl px-14 py-8 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 hover:scale-105 transition-all font-bold shadow-2xl disabled:opacity-50"
                        >
                            Continue
                        </Button>
                    </div>
                </div>
            </div>
        </OnboardingLayout>
    );
};

export default ActivityLevelStep;
