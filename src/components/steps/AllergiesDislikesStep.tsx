import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, XCircle, AlertCircle } from "lucide-react";
import OnboardingLayout from "@/components/layout/OnboardingLayout";
import ChatAvatar from "@/components/onboarding/ChatAvatar";
import TipBox from "@/components/onboarding/TipBox";
import SelectionCard from "@/components/onboarding/SelectionCard";
import ProgressDots from "@/components/onboarding/ProgressDots";
import DailyQuoteBox from "@/components/onboarding/DailyQuoteBox";
import gsap from "gsap";

interface AllergiesDislikesStepProps {
    onNext: (data: { allergies: string[]; dislikes: string[] }) => void;
    onBack: () => void;
    initialData?: { allergies: string[]; dislikes: string[] };
}

const commonAllergies = [
    { id: "peanuts", name: "Peanuts", icon: "🥜" },
    { id: "dairy", name: "Dairy", icon: "🥛" },
    { id: "eggs", name: "Eggs", icon: "🥚" },
    { id: "shellfish", name: "Shellfish", icon: "🦐" },
    { id: "tree-nuts", name: "Tree Nuts", icon: "🌰" },
    { id: "wheat", name: "Wheat", icon: "🌾" },
    { id: "soy", name: "Soy", icon: "🫘" },
    { id: "fish", name: "Fish", icon: "🐟" },
];

const commonDislikes = [
    { id: "mushrooms", name: "Mushrooms", icon: "🍄" },
    { id: "onions", name: "Onions", icon: "🧅" },
    { id: "garlic", name: "Garlic", icon: "🧄" },
    { id: "cilantro", name: "Cilantro", icon: "🌿" },
    { id: "olives", name: "Olives", icon: "🫒" },
    { id: "bell-peppers", name: "Bell Peppers", icon: "🫑" },
    { id: "spicy", name: "Extra Spicy", icon: "🌶️" },
    { id: "bitter", name: "Bitter Gourd", icon: "🥒" },
];

const ShieldAvatar = () => (
    <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-emerald-400 rounded-full flex items-center justify-center text-5xl shadow-2xl border-4 border-white">
        🛡️
    </div>
);

const AllergiesDislikesStep = ({ onNext, onBack, initialData }: AllergiesDislikesStepProps) => {
    const [selectedAllergies, setSelectedAllergies] = useState<string[]>(initialData?.allergies || []);
    const [selectedDislikes, setSelectedDislikes] = useState<string[]>(initialData?.dislikes || []);

    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const avatarRef = useRef<HTMLDivElement>(null);
    const tipRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const allergyRefs = useRef<(HTMLDivElement | null)[]>([]);
    const dislikeRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            tl.from(containerRef.current, { opacity: 0, duration: 0.6 });
            tl.from(avatarRef.current, { scale: 0, rotation: 180, duration: 0.8, ease: "back.out(1.7)" }, 0.2);
            tl.from(tipRef.current, { y: 20, opacity: 0, duration: 0.5 }, 0.4);
            tl.from(titleRef.current, { y: 20, opacity: 0, duration: 0.5 }, 0.5);

            tl.from(allergyRefs.current, {
                scale: 0.5,
                opacity: 0,
                stagger: 0.05,
                duration: 0.4,
                ease: "back.out(1.5)"
            }, 0.6);

            tl.from(dislikeRefs.current, {
                scale: 0.5,
                opacity: 0,
                stagger: 0.05,
                duration: 0.4,
                ease: "back.out(1.5)"
            }, 0.8);

        }, containerRef);
        return () => ctx.revert();
    }, []);

    const toggleAllergy = (id: string) => {
        setSelectedAllergies(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
    };

    const toggleDislike = (id: string) => {
        setSelectedDislikes(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
    };

    const handleNext = () => {
        onNext({ allergies: selectedAllergies, dislikes: selectedDislikes });
    };

    return (
        <OnboardingLayout>
            <DailyQuoteBox />
            <div
                ref={containerRef}
                className="relative h-full w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-teal-400 via-emerald-300 to-teal-50"
            >
                <div ref={contentRef} className="relative z-10 w-full h-full flex flex-col justify-center px-12 py-6 overflow-y-auto">
                    <div ref={avatarRef} className="mb-6 flex justify-center">
                        <ChatAvatar avatar={<ShieldAvatar />} message="Safety first! Any allergies?" />
                    </div>

                    <div ref={tipRef} className="mb-6 max-w-4xl mx-auto">
                        <TipBox>🛡️ We'll filter out ingredients that don't sit well with you!</TipBox>
                    </div>

                    <div className="max-w-5xl mx-auto w-full">
                        <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                            <AlertCircle className="w-6 h-6" /> Common Allergies
                        </h3>
                        <div className="grid grid-cols-4 gap-4 mb-10">
                            {commonAllergies.map((item, i) => (
                                <div key={item.id} ref={el => allergyRefs.current[i] = el}>
                                    <SelectionCard
                                        selected={selectedAllergies.includes(item.id)}
                                        onClick={() => toggleAllergy(item.id)}
                                        className="p-4 text-center cursor-pointer"
                                        style={{ background: selectedAllergies.includes(item.id) ? '#fee2e2' : 'white' }}
                                    >
                                        <span className="text-3xl block mb-1">{item.icon}</span>
                                        <p className="font-bold text-sm text-gray-800">{item.name}</p>
                                    </SelectionCard>
                                </div>
                            ))}
                        </div>

                        <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                            <XCircle className="w-6 h-6" /> Foods You Dislike
                        </h3>
                        <div className="grid grid-cols-4 gap-4 mb-10">
                            {commonDislikes.map((item, i) => (
                                <div key={item.id} ref={el => dislikeRefs.current[i] = el}>
                                    <SelectionCard
                                        selected={selectedDislikes.includes(item.id)}
                                        onClick={() => toggleDislike(item.id)}
                                        className="p-4 text-center cursor-pointer"
                                        style={{ background: selectedDislikes.includes(item.id) ? '#fef3c7' : 'white' }}
                                    >
                                        <span className="text-3xl block mb-1">{item.icon}</span>
                                        <p className="font-bold text-sm text-gray-800">{item.name}</p>
                                    </SelectionCard>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between max-w-5xl mx-auto w-full mt-4">
                        <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/20 font-bold border-2 border-white">
                            <ArrowLeft className="mr-2" /> Back
                        </Button>
                        <ProgressDots currentStep={8} totalSteps={10} />
                        <Button onClick={handleNext} className="bg-white text-teal-600 hover:bg-teal-50 font-black px-10 py-6 text-xl rounded-2xl shadow-xl">
                            Next Step
                        </Button>
                    </div>
                </div>
            </div>
        </OnboardingLayout>
    );
};

export default AllergiesDislikesStep;
