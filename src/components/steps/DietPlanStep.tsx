import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight, AlertCircle, XCircle, Clock, Wallet, Check, ArrowLeft, X } from "lucide-react";
import OnboardingLayout from "@/components/layout/OnboardingLayout";
import ChatAvatar from "@/components/onboarding/ChatAvatar";
import TipBox from "@/components/onboarding/TipBox";
import SelectionCard from "@/components/onboarding/SelectionCard";
import ProgressDots from "@/components/onboarding/ProgressDots";
import DailyQuoteBox from "@/components/onboarding/DailyQuoteBox";
import gsap from "gsap";

interface DietPlanStepProps {
    onNext: (data: {
        dietPlan: string;
        allergies: string[];
        dislikes: string[];
        cookingTime: string;
        monthlyBudget: string;
    }) => void;
    onBack: () => void;
    initialData?: {
        dietPlan: string;
        allergies: string[];
        dislikes: string[];
        cookingTime: string;
        monthlyBudget: string;
    };
}

const dietPlans = [
    { id: "non-vegetarian", title: "Non-Veg", description: "Includes all proteins", icon: "🍗", color: "from-red-400 to-orange-400" },
    { id: "vegetarian", title: "Vegetarian", description: "No meat or fish", icon: "🥕", color: "from-green-400 to-emerald-400" },
    { id: "vegan", title: "Vegan", description: "Plant-based only", icon: "🌱", color: "from-emerald-400 to-teal-400" },
    { id: "pescatarian", title: "Pescatarian", description: "Fish and veggies", icon: "🐟", color: "from-blue-400 to-cyan-400" },
    { id: "eggetarian", title: "Eggetarian", description: "Eggs and veggies", icon: "🥚", color: "from-yellow-400 to-orange-400" },
    { id: "jain", title: "Jain Diet", description: "No root vegetables", icon: "🪷", color: "from-pink-400 to-rose-400" },
    { id: "keto", title: "Keto", description: "High fat, low carb", icon: "🥓", color: "from-orange-400 to-amber-400" },
    { id: "high-protein", title: "High Protein", description: "Focus on muscle", icon: "💪", color: "from-teal-400 to-cyan-400" },
];

const defaultAllergies = [
    { id: "peanuts", name: "Peanuts", icon: "🥜" },
    { id: "dairy", name: "Dairy", icon: "🥛" },
    { id: "eggs", name: "Eggs", icon: "🥚" },
    { id: "shellfish", name: "Shellfish", icon: "🦐" },
    { id: "gluten", name: "Gluten", icon: "🌾" },
    { id: "soy", name: "Soy", icon: "🫘" },
    { id: "tree-nuts", name: "Tree Nuts", icon: "🌰" },
    { id: "fish", name: "Fish", icon: "🐟" },
    { id: "sesame", name: "Sesame", icon: "🫓" },
    { id: "mustard", name: "Mustard", icon: "🟡" },
];

const defaultDislikes = [
    { id: "mushrooms", name: "Mushrooms", icon: "🍄" },
    { id: "onions", name: "Onions", icon: "🧅" },
    { id: "spicy", name: "Extra Spicy", icon: "🌶️" },
    { id: "bitter", name: "Bitter Gourd", icon: "🥒" },
    { id: "garlic", name: "Garlic", icon: "🧄" },
    { id: "tomatoes", name: "Tomatoes", icon: "🍅" },
    { id: "broccoli", name: "Broccoli", icon: "🥦" },
    { id: "olives", name: "Olives", icon: "🫒" },
    { id: "cilantro", name: "Cilantro", icon: "🌿" },
    { id: "seafood", name: "Seafood", icon: "🦞" },
];

const cookingTimeOptions = [
    { id: "15min", name: "Quick", time: "15m", icon: "⚡" },
    { id: "30min", name: "Medium", time: "30m", icon: "🍳" },
    { id: "60min", name: "Gourmet", time: "1h+", icon: "👨‍🍳" },
];

const budgetOptions = [
    { id: "economy", name: "Economy", range: "₹5k-8k", icon: "🪙" },
    { id: "standard", name: "Standard", range: "₹9k-15k", icon: "💵" },
    { id: "premium", name: "Premium", range: "₹15k+", icon: "💎" },
];

const FoodAvatar = () => (
    <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-5xl shadow-2xl border-4 border-white">
        🍽️
    </div>
);

const DietPlanStep = ({ onNext, onBack, initialData }: DietPlanStepProps) => {
    // State for managing sub-steps and custom items
    const [subStep, setSubStep] = useState(0); // 0: Diet, 1: Allergies, 2: Dislikes, 3: Preferences
    const [selectedDiet, setSelectedDiet] = useState(initialData?.dietPlan || "");
    const [selectedAllergies, setSelectedAllergies] = useState<string[]>(initialData?.allergies || []);
    const [selectedDislikes, setSelectedDislikes] = useState<string[]>(initialData?.dislikes || []);
    const [cookingTime, setCookingTime] = useState(initialData?.cookingTime || "30min");
    const [budgetValue, setBudgetValue] = useState(initialData?.monthlyBudget === 'economy' ? 5000 : initialData?.monthlyBudget === 'premium' ? 20000 : 12000);

    // Section visibility states - sections appear one by one
    const [showAllergies, setShowAllergies] = useState(false);
    const [showDislikes, setShowDislikes] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);

    const [customDiets, setCustomDiets] = useState<string[]>([]);
    const [customItems, setCustomItems] = useState<{ type: 'allergy' | 'dislike', name: string }[]>([]);
    const [showInput, setShowInput] = useState<null | 'diet' | 'allergy' | 'dislike'>(null);
    const [inputValue, setInputValue] = useState("");

    const allDietPlans = [
        ...dietPlans,
        ...customDiets.map(d => ({
            id: d,
            title: d,
            description: "Custom Diet Plan",
            icon: "✨",
            color: "from-purple-400 to-indigo-400"
        }))
    ];

    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const avatarRef = useRef<HTMLDivElement>(null);
    const revealRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(contentRef.current, { opacity: 0, y: 30, duration: 0.8, ease: "power3.out" });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    useEffect(() => {
        if (revealRef.current) {
            gsap.fromTo(revealRef.current,
                { opacity: 0, x: 50 },
                { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
            );
        }
    }, [subStep]);

    const handleDietSelect = (id: string) => {
        setSelectedDiet(id);
        // Show allergies section after diet is selected
        setTimeout(() => setShowAllergies(true), 300);
    };

    const handleAddCustom = (type: 'diet' | 'allergy' | 'dislike') => {
        if (inputValue.trim()) {
            if (type === 'diet') {
                setCustomDiets([...customDiets, inputValue.trim()]);
                setSelectedDiet(inputValue.trim().toLowerCase().replace(/\s/g, '-'));
            } else {
                setCustomItems([...customItems, { type, name: inputValue.trim() }]);
                if (type === 'allergy') {
                    setSelectedAllergies([...selectedAllergies, inputValue.trim()]);
                } else {
                    setSelectedDislikes([...selectedDislikes, inputValue.trim()]);
                }
            }
            setInputValue("");
            setShowInput(null);
        }
    };
    const handleContinue = () => {
        const budgetCategory = budgetValue <= 8000 ? 'economy' : budgetValue >= 15000 ? 'premium' : 'standard';
        onNext({ dietPlan: selectedDiet, allergies: selectedAllergies, dislikes: selectedDislikes, cookingTime, monthlyBudget: budgetCategory });
    };

    const handleBack = () => {
        onBack();
    };

    const currentAllergies = [...defaultAllergies, ...customItems.filter(i => i.type === 'allergy').map(i => ({ id: i.name, name: i.name, icon: "🏷️" }))];
    const currentDislikes = [...defaultDislikes, ...customItems.filter(i => i.type === 'dislike').map(i => ({ id: i.name, name: i.name, icon: "🏷️" }))];

    return (
        <OnboardingLayout>
            <DailyQuoteBox />
            <div ref={containerRef} className="relative h-full w-full flex items-center justify-center overflow-y-auto pt-24 pb-12 bg-gradient-to-br from-purple-300 via-pink-200 to-purple-50">
                <div ref={contentRef} className="relative z-10 w-full max-w-5xl px-12">
                    <div ref={avatarRef} className="mb-6 flex justify-center">
                        <ChatAvatar avatar={<FoodAvatar />} message={
                            subStep === 0 ? "Let's start with your diet plan!" :
                                subStep === 1 ? "Any allergies I should know about?" :
                                    subStep === 2 ? "Any foods you'd rather avoid?" :
                                        "Almost there! How do you like to cook?"
                        } />
                    </div>

                    <div ref={revealRef}>
                        {subStep === 0 && (
                            <div className="space-y-6">
                                <h2 className="text-center text-3xl font-black text-white drop-shadow-lg">Select your diet plan</h2>
                                {/* Grid of options - 4 columns, smaller cards */}
                                <div className="grid grid-cols-4 gap-4 mb-6 max-w-5xl mx-auto w-full">
                                    {allDietPlans.map((plan) => (
                                        <SelectionCard
                                            key={plan.id}
                                            selected={selectedDiet === plan.id}
                                            onClick={() => handleDietSelect(plan.id)}
                                            className={`relative flex flex-col items-center justify-center transition-all duration-300 ${selectedDiet === plan.id ? 'ring-4 ring-white shadow-2xl scale-105' : 'hover:scale-105'}`}
                                            style={{
                                                height: '140px',
                                                borderRadius: '20px',
                                                background: `linear-gradient(135deg, ${plan.color.includes('from-') ? '#9333ea' : plan.color.split(' ')[0]}, ${plan.color.includes('to-') ? '#db2777' : plan.color.split(' ')[2] || plan.color.split(' ')[0]})`
                                            }}
                                        >
                                            <span className="text-4xl mb-2">{plan.icon}</span>
                                            <h3 className="text-lg font-black text-white mb-1">{plan.title}</h3>
                                            <p className="text-white/80 text-xs text-center px-2">{plan.description}</p>
                                        </SelectionCard>
                                    ))}
                                </div>

                                {/* Allergies Section - Shows when diet is selected */}
                                {selectedDiet && showAllergies && (
                                    <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
                                        <h3 className="text-center text-2xl font-black text-white drop-shadow-lg flex items-center justify-center gap-2">
                                            <AlertCircle className="w-6 h-6" /> Any Allergies?
                                        </h3>
                                        <div className="flex flex-wrap justify-center gap-3">
                                            {currentAllergies.map(a => (
                                                <button
                                                    key={a.id}
                                                    onClick={() => {
                                                        setSelectedAllergies(prev => prev.includes(a.id) ? prev.filter(x => x !== a.id) : [...prev, a.id]);
                                                        // Auto-show dislikes section after first allergy touch
                                                        if (!showDislikes) setTimeout(() => setShowDislikes(true), 400);
                                                    }}
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm transition-all ${selectedAllergies.includes(a.id) ? 'bg-purple-600 text-white shadow-lg scale-105' : 'bg-white/80 text-gray-700 hover:bg-white'}`}
                                                >
                                                    <span className="text-lg">{a.icon}</span> {a.name}
                                                    {selectedAllergies.includes(a.id) && <Check className="w-4 h-4" />}
                                                </button>
                                            ))}
                                            {/* None Button */}
                                            <button
                                                onClick={() => {
                                                    setSelectedAllergies([]);
                                                    if (!showDislikes) setTimeout(() => setShowDislikes(true), 400);
                                                }}
                                                className="flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm bg-white/40 text-purple-700 border-2 border-purple-400 hover:bg-white/60 transition-all"
                                            >
                                                ✓ None
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Dislikes Section - Shows after allergies */}
                                {showDislikes && (
                                    <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300 mt-6">
                                        <h3 className="text-center text-2xl font-black text-white drop-shadow-lg flex items-center justify-center gap-2">
                                            <XCircle className="w-6 h-6" /> Foods You Dislike?
                                        </h3>
                                        <div className="flex flex-wrap justify-center gap-3">
                                            {currentDislikes.map(d => (
                                                <button
                                                    key={d.id}
                                                    onClick={() => {
                                                        setSelectedDislikes(prev => prev.includes(d.id) ? prev.filter(x => x !== d.id) : [...prev, d.id]);
                                                        // Auto-show preferences section after first dislike touch
                                                        if (!showPreferences) setTimeout(() => setShowPreferences(true), 400);
                                                    }}
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm transition-all ${selectedDislikes.includes(d.id) ? 'bg-pink-600 text-white shadow-lg scale-105' : 'bg-white/80 text-gray-700 hover:bg-white'}`}
                                                >
                                                    <span className="text-lg">{d.icon}</span> {d.name}
                                                    {selectedDislikes.includes(d.id) && <Check className="w-4 h-4" />}
                                                </button>
                                            ))}
                                            {/* None Button */}
                                            <button
                                                onClick={() => {
                                                    setSelectedDislikes([]);
                                                    if (!showPreferences) setTimeout(() => setShowPreferences(true), 400);
                                                }}
                                                className="flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm bg-white/40 text-pink-700 border-2 border-pink-400 hover:bg-white/60 transition-all"
                                            >
                                                ✓ None
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Cooking Time and Budget - Shows after dislikes */}
                                {showPreferences && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 animate-in slide-in-from-bottom-4 duration-300">
                                        {/* Cooking Time */}
                                        <div className="bg-white/40 backdrop-blur-md rounded-2xl p-4 border-2 border-white/30 shadow-xl">
                                            <h4 className="text-lg font-black text-purple-700 mb-3 flex items-center gap-2">
                                                <Clock className="w-5 h-5" /> Cooking Time
                                            </h4>
                                            <div className="grid grid-cols-3 gap-2">
                                                {cookingTimeOptions.map(t => (
                                                    <button
                                                        key={t.id}
                                                        onClick={() => setCookingTime(t.id)}
                                                        className={`flex flex-col items-center gap-1 p-3 rounded-xl font-bold transition-all ${cookingTime === t.id ? 'bg-purple-600 text-white shadow-lg scale-105' : 'bg-white/80 text-gray-600 hover:bg-white'}`}
                                                    >
                                                        <span className="text-xl">{t.icon}</span>
                                                        <span className="text-xs uppercase">{t.name}</span>
                                                        <span className="text-xs opacity-70">{t.time}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Monthly Budget Slider */}
                                        <div className="bg-white/40 backdrop-blur-md rounded-2xl p-4 border-2 border-white/30 shadow-xl">
                                            <h4 className="text-lg font-black text-purple-700 mb-3 flex items-center gap-2">
                                                <Wallet className="w-5 h-5" /> Monthly Budget
                                            </h4>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-2xl font-black text-pink-600">₹{budgetValue.toLocaleString()}</span>
                                                    <span className="text-sm font-bold text-gray-500">
                                                        {budgetValue <= 8000 ? '🪙 Economy' : budgetValue >= 15000 ? '💎 Premium' : '💵 Standard'}
                                                    </span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="3000"
                                                    max="25000"
                                                    step="500"
                                                    value={budgetValue}
                                                    onChange={(e) => setBudgetValue(Number(e.target.value))}
                                                    className="w-full h-3 bg-gradient-to-r from-purple-200 via-pink-300 to-pink-400 rounded-full appearance-none cursor-pointer slider-thumb"
                                                    style={{
                                                        background: `linear-gradient(to right, #9333ea ${((budgetValue - 3000) / 22000) * 100}%, #e5e7eb ${((budgetValue - 3000) / 22000) * 100}%)`
                                                    }}
                                                />
                                                <div className="flex justify-between text-xs text-gray-500 font-bold">
                                                    <span>₹3k</span>
                                                    <span>₹10k</span>
                                                    <span>₹20k</span>
                                                    <span>₹25k</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between mt-12 bg-white/20 p-5 rounded-4xl backdrop-blur-md border border-white/30">
                        <Button variant="ghost" onClick={handleBack} className="text-purple-700 hover:bg-white/40 font-black px-8 py-7 h-auto text-lg rounded-2xl">
                            <ArrowLeft className="mr-2 w-6 h-6" /> {subStep === 0 ? "Back" : "Previous"}
                        </Button>
                        <div className="hidden md:block">
                            <ProgressDots currentStep={7} totalSteps={8} />
                        </div>
                        <Button
                            onClick={handleContinue}
                            disabled={subStep === 0 && !selectedDiet}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black px-12 py-7 h-auto text-xl rounded-2xl shadow-2xl hover:scale-105 transition-all flex items-center gap-3 group"
                        >
                            {subStep === 3 ? "Complete" : "Next"}
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </div>
            </div>
        </OnboardingLayout>
    );
};

export default DietPlanStep;
