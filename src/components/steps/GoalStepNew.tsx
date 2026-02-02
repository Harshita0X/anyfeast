import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import OnboardingLayout from "@/components/layout/OnboardingLayout";
import ChatAvatar from "@/components/onboarding/ChatAvatar";
import TipBox from "@/components/onboarding/TipBox";
import SelectionCard from "@/components/onboarding/SelectionCard";
import ProgressDots from "@/components/onboarding/ProgressDots";
import DailyQuoteBox from "@/components/onboarding/DailyQuoteBox";
import gsap from "gsap";

interface GoalStepProps {
  onNext: (data: { goal: string; targetWeeks: number }) => void;
  onBack: () => void;
  initialGoal?: string;
}

const goals = [
  {
    id: "weight-loss",
    name: "Weight Loss",
    emoji: "🏃",
    description: "Shed extra pounds",
    color: "text-green-600",
    bgImage: "public/weoghtloss.png"
  },
  {
    id: "muscle-gain",
    name: "Build Muscle",
    emoji: "💪",
    description: "Get stronger",
    color: "text-teal-600",
    bgImage: "public/muscle.png"
  },
  {
    id: "maintain",
    name: "Stay Fit",
    emoji: "⚖️",
    description: "Maintain health",
    color: "text-emerald-600",
    bgImage: "public/stay.png"
  },
  {
    id: "lifestyle",
    name: "Better Lifestyle",
    emoji: "✨",
    description: "Overall wellness",
    color: "text-cyan-600",
    bgImage: "public/better.png"
  },
];

const TargetAvatar = () => (
  <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-teal-400 rounded-full flex items-center justify-center text-5xl shadow-2xl border-4 border-white">
    🎯
  </div>
);

const GoalStepNew = ({ onNext, onBack, initialGoal }: GoalStepProps) => {
  const [selectedGoal, setSelectedGoal] = useState(initialGoal || "");
  const [targetWeeks, setTargetWeeks] = useState(12);
  const [showTimeSlider, setShowTimeSlider] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const particlesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Background fades in with slight rotation
      tl.from(containerRef.current, {
        opacity: 0,
        rotation: -2,
        duration: 0.8,
        ease: "power3.out"
      });

      // Avatar spins in
      tl.from(avatarRef.current, {
        scale: 0,
        rotation: 1080,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out"
      }, 0.3);

      // Tip box pops from bottom
      tl.from(tipRef.current, {
        y: 80,
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(2)"
      }, 0.7);

      // Title bounces in
      tl.from(titleRef.current, {
        scale: 0,
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.6)"
      }, 0.9);

      // Cards drop from top with elastic bounce
      tl.from(cardRefs.current, {
        y: -200,
        opacity: 0,
        rotation: 15,
        stagger: 0.12,
        duration: 0.9,
        ease: "bounce.out"
      }, 1.1);

      // Continuous animations
      // Avatar floats only (no rotation)
      gsap.to(avatarRef.current, {
        y: -15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Pulsing glow
      gsap.to(contentRef.current, {
        boxShadow: "0 0 100px rgba(20, 184, 166, 0.3)",
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Animate particles
      particlesRef.current.forEach((particle, i) => {
        if (particle) {
          gsap.to(particle, {
            x: `random(-60, 60)`,
            y: `random(-60, 60)`,
            rotation: `random(0, 360)`,
            scale: `random(0.5, 1.5)`,
            duration: `random(4, 7)`,
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

  const handleCardClick = (goalId: string, index: number) => {
    setSelectedGoal(goalId);
    // Show time slider after goal selection
    setTimeout(() => setShowTimeSlider(true), 400);

    // Ripple effect on click
    if (cardRefs.current[index]) {
      gsap.timeline()
        .to(cardRefs.current[index], {
          scale: 0.95,
          duration: 0.1,
          ease: "power2.in"
        })
        .to(cardRefs.current[index], {
          scale: 1.05,
          duration: 0.3,
          ease: "elastic.out(1, 0.5)"
        })
        .to(cardRefs.current[index], {
          scale: 1,
          duration: 0.2,
          ease: "power2.out"
        });
    }
  };

  const allGoals = goals;

  const handleCardHover = (index: number, isEntering: boolean) => {
    if (cardRefs.current[index]) {
      gsap.to(cardRefs.current[index], {
        scale: isEntering ? 1.05 : 1,
        y: isEntering ? -10 : 0,
        rotation: isEntering ? 2 : 0,
        boxShadow: isEntering ? "0 30px 60px rgba(20, 184, 166, 0.5)" : "0 10px 30px rgba(0,0,0,0.1)",
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const handleContinue = () => {
    if (!selectedGoal) return;

    const tl = gsap.timeline({
      onComplete: () => onNext({ goal: selectedGoal, targetWeeks })
    });

    // Cards fly up
    tl.to(cardRefs.current, {
      y: -300,
      opacity: 0,
      rotation: -20,
      stagger: 0.08,
      duration: 0.6,
      ease: "power4.in"
    });

    // Content fades
    tl.to(contentRef.current, {
      opacity: 0,
      scale: 1.1,
      duration: 0.5,
      ease: "power2.in"
    }, 0.3);
  };

  return (
    <OnboardingLayout>
      <DailyQuoteBox />
      <div
        ref={containerRef}
        className="relative h-full w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-400 via-teal-300 to-green-50"
      >
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              ref={(el) => (particlesRef.current[i] = el)}
              className="absolute w-3 h-3 bg-white/30 rounded-full blur-sm"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
          <div className="absolute top-20 left-20 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-teal-300/20 rounded-full blur-3xl" />
        </div>

        {/* Main content */}
        <div
          ref={contentRef}
          className="relative z-10 w-full h-full flex flex-col justify-center px-12 py-6"
        >
          {/* Chat Avatar */}
          <div ref={avatarRef} className="mb-6 flex justify-center">
            <ChatAvatar
              avatar={<TargetAvatar />}
              message="What's your dream goal?"
            />
          </div>

          {/* Tip Box */}
          <div ref={tipRef} className="mb-8 max-w-3xl mx-auto">
            <TipBox>
              🌟 Setting clear goals increases your success rate by 42%!
            </TipBox>
          </div>

          {/* Title */}
          <h2
            ref={titleRef}
            className="text-center text-4xl font-black text-white mb-6 drop-shadow-lg"
          >
            Choose what matters most to you right now
          </h2>


          {/* Goal Cards */}
          <div className="grid grid-cols-2 gap-10 mb-10 max-w-6xl mx-auto w-full" style={{ gridAutoRows: '1fr' }}>
            {allGoals.map((goal, index) => (
              <div
                key={goal.id}
                ref={(el) => (cardRefs.current[index] = el)}
                onMouseEnter={() => handleCardHover(index, true)}
                onMouseLeave={() => handleCardHover(index, false)}
              >
                <SelectionCard
                  selected={selectedGoal === goal.id}
                  onClick={() => handleCardClick(goal.id, index)}
                  className={`relative overflow-hidden text-center transition-all duration-300 cursor-pointer ${selectedGoal === goal.id
                    ? 'ring-8 ring-white shadow-2xl'
                    : 'ring-0'
                    }`}
                  style={{
                    height: '260px',
                    width: '550px',
                    borderRadius: '24px',
                    ...({
                      background: goal.id === 'weight-loss'
                        ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
                        : goal.id === 'muscle-gain'
                          ? 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)'
                          : goal.id === 'maintain'
                            ? 'linear-gradient(135deg, #d1fae5 0%, #6ee7b7 100%)'
                            : 'linear-gradient(135deg, #cffafe 0%, #a5f3fc 100%)'
                    })
                  }}
                >
                  {/* Background Illustration - Ensuring it fills COMPLETELY */}
                  {goal.bgImage && (
                    <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
                      <img
                        src={goal.bgImage}
                        alt=""
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                        }}
                      />
                      {/* Gradient overlay to make text readable */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
                    </div>
                  )}

                  {/* Background blur overlays for depth */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-green-400 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-400 rounded-full blur-2xl" />
                  </div>

                  <div className="relative z-10 h-full flex flex-col items-center justify-center py-8 px-8">
                    <p className={`font-black text-4xl mb-2 drop-shadow-md ${selectedGoal === goal.id ? 'text-gray-900' : 'text-gray-800'
                      }`}>
                      {goal.name}
                    </p>
                    <p className={`text-xl font-medium drop-shadow-sm ${selectedGoal === goal.id ? 'text-gray-800' : 'text-gray-700'
                      }`}>
                      {goal.description}
                    </p>
                  </div>
                </SelectionCard>
              </div>
            ))}
          </div>

          {/* Time Slider - appears after goal selection */}
          {showTimeSlider && (
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 max-w-2xl mx-auto mb-8 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
              <h4 className="text-xl font-black text-green-700 mb-4 text-center">⏰ Estimated Time to Achieve Your Goal</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-black text-teal-600">{targetWeeks} weeks</span>
                  <span className="text-lg font-bold text-gray-500">
                    {targetWeeks <= 8 ? '🚀 Fast Track' : targetWeeks >= 20 ? '🧘 Steady Pace' : '⚡ Balanced'}
                  </span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="52"
                  step="1"
                  value={targetWeeks}
                  onChange={(e) => setTargetWeeks(Number(e.target.value))}
                  className="w-full h-3 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #14b8a6 ${((targetWeeks - 4) / 48) * 100}%, #e5e7eb ${((targetWeeks - 4) / 48) * 100}%)`
                  }}
                />
                <div className="flex justify-between text-sm text-gray-500 font-bold">
                  <span>4 weeks</span>
                  <span>6 months</span>
                  <span>1 year</span>
                </div>
              </div>
            </div>
          )}


          {/* Progress & Navigation */}
          <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
            <Button
              variant="ghost"
              onClick={onBack}
              className="gap-3 text-xl px-8 py-8 bg-white/90 hover:bg-white hover:scale-105 transition-all text-green-600 font-bold"
            >
              <ArrowLeft className="w-6 h-6" />
              Back
            </Button>

            <ProgressDots currentStep={6} totalSteps={8} />

            <Button
              variant="default"
              onClick={handleContinue}
              disabled={!selectedGoal}
              className="text-xl px-14 py-8 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 hover:scale-105 transition-all font-bold shadow-2xl disabled:opacity-50"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default GoalStepNew;
