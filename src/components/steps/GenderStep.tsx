import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User } from "lucide-react";
import OnboardingLayout from "@/components/layout/OnboardingLayout";
import ChatAvatar from "@/components/onboarding/ChatAvatar";
import TipBox from "@/components/onboarding/TipBox";
import SelectionCard from "@/components/onboarding/SelectionCard";
import ProgressDots from "@/components/onboarding/ProgressDots";
import DailyQuoteBox from "@/components/onboarding/DailyQuoteBox";
import gsap from "gsap";

interface GenderStepProps {
  onNext: (gender: string) => void;
  onBack: () => void;
  initialGender?: string;
}

const genders = [
  {
    id: "male",
    name: "Male",
    color: "text-blue-500",
    emoji: "👨",
    bgImage: "C:/Users/Harshita/.gemini/antigravity/brain/b9aad930-8646-4664-aa94-e08c5c21ada0/male_character_1769961462378.png"
  },
  {
    id: "female",
    name: "Female",
    color: "text-purple-500",
    emoji: "👩",
    bgImage: "C:/Users/Harshita/.gemini/antigravity/brain/b9aad930-8646-4664-aa94-e08c5c21ada0/female_character_1769961478064.png"
  },
  {
    id: "other",
    name: "Other",
    color: "text-indigo-500",
    emoji: "⚧",
    bgImage: "C:/Users/Harshita/.gemini/antigravity/brain/b9aad930-8646-4664-aa94-e08c5c21ada0/male_character_1769961462378.png" // Using male as fallback
  },
];

const PersonAvatar = () => (
  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
    <User className="w-14 h-14 text-white" />
  </div>
);

const GenderStep = ({ onNext, onBack, initialGender }: GenderStepProps) => {
  const [selectedGender, setSelectedGender] = useState(initialGender || "");
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRevealRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const particlesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Circular reveal - starts small in center and expands outward
      tl.fromTo(circleRevealRef.current,
        { scale: 0, borderRadius: "50%", opacity: 1 },
        {
          scale: 30,
          duration: 1,
          ease: "power4.inOut"
        }
      );

      // Fade out the reveal overlay so content is visible
      tl.to(circleRevealRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out"
      }, "-=0.3");

      // Background zoom and rotate
      tl.from(containerRef.current, {
        scale: 0.8,
        rotation: 5,
        duration: 1,
        ease: "power3.out"
      }, 0.3);

      // Avatar bounces in
      tl.from(avatarRef.current, {
        scale: 0,
        y: -100,
        rotation: 360,
        opacity: 0,
        duration: 0.9,
        ease: "bounce.out"
      }, 0.8);

      // Tip box slides from right


      // Title pops in
      tl.from(titleRef.current, {
        scale: 0.3,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(2)"
      }, 1.2);

      // Gender cards rotate in 3D
      tl.from(cardRefs.current, {
        y: 30,
        scale: 0.9,
        opacity: 0,
        stagger: 0.12,
        duration: 0.5,
        ease: "power2.out"
      }, 1.2);


      // Floating avatar (no rotation)
      gsap.to(avatarRef.current, {
        y: -10,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Pulsing glow
      gsap.to(contentRef.current, {
        boxShadow: "0 0 100px rgba(99, 102, 241, 0.3)",
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
            duration: `random(4, 6)`,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.12
          });
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleCardHover = (index: number, isEntering: boolean) => {
    if (cardRefs.current[index]) {
      gsap.to(cardRefs.current[index], {
        scale: isEntering ? 1.05 : 1,
        rotationY: isEntering ? 8 : 0,
        y: isEntering ? -10 : 0,
        boxShadow: isEntering ? "0 30px 60px rgba(139, 92, 246, 0.5)" : "0 10px 30px rgba(0,0,0,0.1)",
        duration: 0.3,
        ease: "power2.out",
        transformPerspective: 1000
      });
    }
  };

  const handleContinue = () => {
    if (!selectedGender) return;

    const tl = gsap.timeline({
      onComplete: () => onNext(selectedGender)
    });

    // Content scales down
    tl.to(contentRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      ease: "power2.in"
    });

    // Circular close
    tl.to(circleRevealRef.current, {
      scale: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power4.in"
    }, 0.2);
  };

  return (
    <OnboardingLayout>
      <DailyQuoteBox />
      <div
        ref={containerRef}
        className="relative h-full w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-400 via-purple-300 to-blue-50"
      >
        {/* Circular reveal overlay */}
        <div
          ref={circleRevealRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-blue-700 to-purple-700 z-50 pointer-events-none"
        />

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(18)].map((_, i) => (
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
              avatar={<PersonAvatar />}
              message="Tell me about yourself!"
            />
          </div>

          {/* Tip Box */}
          <div ref={tipRef} className="mb-8 max-w-3xl mx-auto">
            <TipBox>
              ⚡ Did you know? Your metabolism is unique to YOU, not your gender!
            </TipBox>
          </div>

          {/* Title */}
          <h2
            ref={titleRef}
            className="text-center text-4xl font-black text-white mb-10 drop-shadow-lg"
          >
            This helps us calculate accurate health metrics
          </h2>

          {/* Gender Cards */}
          <div className="grid grid-cols-3 gap-10 mb-10 max-w-6xl mx-auto w-full">
            {genders.map((gender, index) => (
              <div
                key={gender.id}
                ref={(el) => (cardRefs.current[index] = el)}
                onMouseEnter={() => handleCardHover(index, true)}
                onMouseLeave={() => handleCardHover(index, false)}
                style={{ transformStyle: "preserve-3d" }}
              >
                <SelectionCard
                  selected={selectedGender === gender.id}
                  onClick={() => setSelectedGender(gender.id)}
                  className={`relative overflow-hidden w-full transition-all duration-300 cursor-pointer ${selectedGender === gender.id
                    ? 'ring-8 ring-white shadow-2xl'
                    : 'ring-0'
                    }`}
                  style={{
                    height: '260px',
                    borderRadius: '24px',
                    background: gender.id === 'male'
                      ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
                      : gender.id === 'female'
                        ? 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)'
                        : 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)'
                  }}
                >
                  {/* Background Illustration - Full Coverage */}
                  <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
                    <img
                      src={gender.bgImage}
                      alt=""
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        opacity: 0.5,
                        filter: selectedGender === gender.id ? 'brightness(1.1)' : 'brightness(1)'
                      }}
                    />
                  </div>

                  {/* Background blur overlays */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 rounded-full blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-28 h-28 bg-purple-400 rounded-full blur-xl" />
                  </div>

                  {/* Content - centered */}
                  <div className="relative z-10 h-full flex flex-col items-center justify-center">
                    <p className={`font-black text-4xl drop-shadow-md ${selectedGender === gender.id ? 'text-gray-900' : 'text-gray-800'
                      }`}>
                      {gender.name}
                    </p>
                  </div>
                </SelectionCard>
              </div>
            ))}
          </div>

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

            <ProgressDots currentStep={2} totalSteps={8} />

            <Button
              variant="default"
              onClick={handleContinue}
              disabled={!selectedGender}
              className="text-xl px-14 py-8 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover:scale-105 transition-all font-bold shadow-2xl disabled:opacity-50"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default GenderStep;
