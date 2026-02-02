import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import OnboardingLayout from "@/components/layout/OnboardingLayout";
import ChatAvatar from "@/components/onboarding/ChatAvatar";
import TipBox from "@/components/onboarding/TipBox";
import ProgressDots from "@/components/onboarding/ProgressDots";
import DailyQuoteBox from "@/components/onboarding/DailyQuoteBox";
import gsap from "gsap";

interface BirthdayStepProps {
    onNext: (birthday: { day: number; month: number; year: number }) => void;
    onBack: () => void;
    initialBirthday?: { day: number; month: number; year: number };
}

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const CakeAvatar = () => (
    <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-5xl shadow-2xl border-4 border-white">
        🎂
    </div>
);

const BirthdayStep = ({ onNext, onBack, initialBirthday }: BirthdayStepProps) => {
    const currentYear = new Date().getFullYear();
    const [birthday, setBirthday] = useState(
        initialBirthday || { day: 1, month: 0, year: currentYear - 25 }
    );

    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const avatarRef = useRef<HTMLDivElement>(null);
    const tipRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const formRef = useRef<HTMLDivElement>(null);

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
                rotation: 720,
                opacity: 0,
                duration: 1,
                ease: "back.out(2)"
            }, 0.3);

            tl.from(tipRef.current, {
                x: 200,
                opacity: 0,
                duration: 0.6,
                ease: "power3.out"
            }, 0.6);

            tl.from(titleRef.current, {
                scale: 0,
                y: -50,
                opacity: 0,
                duration: 0.7,
                ease: "elastic.out(1, 0.6)"
            }, 0.9);

            tl.from(formRef.current, {
                y: 50,
                opacity: 0,
                scale: 0.9,
                duration: 0.6,
                ease: "back.out(1.7)"
            }, 1.2);

            // Floating avatar
            gsap.to(avatarRef.current, {
                y: -12,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleContinue = () => {
        const tl = gsap.timeline({
            onComplete: () => onNext(birthday)
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
                className="relative h-full w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-300 via-purple-200 to-pink-50"
            >
                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl" />
                </div>

                {/* Main content */}
                <div
                    ref={contentRef}
                    className="relative z-10 w-full h-full flex flex-col justify-center px-12 py-6"
                >
                    {/* Chat Avatar */}
                    <div ref={avatarRef} className="mb-6 flex justify-center">
                        <ChatAvatar
                            avatar={<CakeAvatar />}
                            message="When's your birthday?"
                        />
                    </div>

                    {/* Tip Box */}
                    <div ref={tipRef} className="mb-8 max-w-3xl mx-auto">
                        <TipBox>
                            🎯 Age is just a number... but it does affect your metabolism! 😊
                        </TipBox>
                    </div>

                    {/* Title */}
                    <h2
                        ref={titleRef}
                        className="text-center text-3xl font-black text-white mb-6 drop-shadow-lg"
                    >
                        We use this to calculate your BMR and personalize your plan
                    </h2>

                    {/* Birthday Form */}
                    <div
                        ref={formRef}
                        className="bg-white/95 rounded-3xl p-10 shadow-2xl max-w-2xl mx-auto w-full"
                    >
                        <div className="grid grid-cols-3 gap-6 mb-8">
                            {/* Day */}
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-3">Day</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="31"
                                    value={birthday.day}
                                    onChange={(e) => setBirthday({ ...birthday, day: parseInt(e.target.value) || 1 })}
                                    className="w-full px-6 py-4 text-2xl font-black text-gray-800 border-3 border-purple-200 rounded-2xl text-center focus:outline-none focus:ring-4 focus:ring-purple-400 transition-all"
                                />
                            </div>

                            {/* Month */}
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-3">Month</label>
                                <select
                                    value={birthday.month}
                                    onChange={(e) => setBirthday({ ...birthday, month: parseInt(e.target.value) })}
                                    className="w-full px-6 py-4 text-xl font-bold text-gray-800 border-3 border-purple-200 rounded-2xl text-center focus:outline-none focus:ring-4 focus:ring-purple-400 transition-all appearance-none bg-white cursor-pointer"
                                >
                                    {months.map((month, index) => (
                                        <option key={index} value={index}>
                                            {month}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Year */}
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-3">Year</label>
                                <input
                                    type="number"
                                    min="1900"
                                    max={currentYear}
                                    value={birthday.year}
                                    onChange={(e) => setBirthday({ ...birthday, year: parseInt(e.target.value) || currentYear })}
                                    placeholder="Year"
                                    className="w-full px-6 py-4 text-2xl font-black text-gray-800 border-3 border-purple-200 rounded-2xl text-center focus:outline-none focus:ring-4 focus:ring-purple-400 transition-all"
                                />
                            </div>
                        </div>

                        <Button
                            variant="default"
                            onClick={handleContinue}
                            className="w-full text-xl px-8 py-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-105 transition-all font-black shadow-xl"
                        >
                            Continue
                        </Button>
                    </div>

                    {/* Progress & Navigation */}
                    <div className="flex items-center justify-between max-w-2xl mx-auto w-full mt-8">
                        <Button
                            variant="ghost"
                            onClick={onBack}
                            className="gap-3 text-xl px-8 py-6 bg-white/90 hover:bg-white hover:scale-105 transition-all text-purple-600 font-bold"
                        >
                            <ArrowLeft className="w-6 h-6" />
                            Back
                        </Button>

                        <ProgressDots currentStep={3} totalSteps={8} />
                    </div>
                </div>
            </div>
        </OnboardingLayout>
    );
};

export default BirthdayStep;
