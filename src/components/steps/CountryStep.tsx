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

interface CountryStepProps {
  onNext: (country: string) => void;
  onBack: () => void;
  initialCountry?: string;
}

const countries = [
  { id: "india", name: "India", currency: "INR", flag: "IN" },
  { id: "uk", name: "United Kingdom", currency: "GBP", flag: "UK" },
];

const GlobeAvatar = () => (
  <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-yellow-300 rounded-full flex items-center justify-center text-5xl shadow-2xl border-4 border-white">
    🌍
  </div>
);

const CountryStep = ({ onNext, onBack, initialCountry }: CountryStepProps) => {
  const [selectedCountry, setSelectedCountry] = useState(initialCountry || "india");
  const containerRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const countryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const particlesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Wipe reveal animation - slide from top to bottom
      tl.to(revealRef.current, {
        y: "100%",
        duration: 1.2,
        ease: "power4.inOut"
      });

      // Zoom and fade in background
      tl.from(containerRef.current, {
        scale: 1.3,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      }, 0.3);

      // Content slides up dramatically
      tl.from(contentRef.current, {
        y: 100,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }, 0.8);

      // Avatar pops in with bounce
      tl.from(avatarRef.current, {
        scale: 0,
        rotation: 360,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(2)"
      }, 1);

      // Tip box slides from left
      tl.from(tipRef.current, {
        x: -200,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out"
      }, 1.2);

      // Title appears with scale
      tl.from(titleRef.current, {
        scale: 0.5,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.7)"
      }, 1.4);

      // Country cards stagger in from bottom
      tl.from(countryRefs.current, {
        y: 80,
        opacity: 0,
        scale: 0.8,
        stagger: 0.2,
        duration: 0.6,
        ease: "back.out(1.5)"
      }, 1.6);

      // Floating avatar animation
      gsap.to(avatarRef.current, {
        y: -12,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Pulsing glow on content
      gsap.to(contentRef.current, {
        boxShadow: "0 0 100px rgba(249, 115, 22, 0.3)",
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Animate particles
      particlesRef.current.forEach((particle, i) => {
        if (particle) {
          gsap.to(particle, {
            x: `random(-80, 80)`,
            y: `random(-80, 80)`,
            rotation: `random(0, 360)`,
            duration: `random(4, 7)`,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.15
          });
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleCountryHover = (index: number, isEntering: boolean) => {
    if (countryRefs.current[index]) {
      gsap.to(countryRefs.current[index], {
        scale: isEntering ? 1.08 : 1,
        y: isEntering ? -8 : 0,
        boxShadow: isEntering ? "0 25px 50px rgba(249, 115, 22, 0.4)" : "0 10px 30px rgba(0,0,0,0.1)",
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const handleContinue = () => {
    const tl = gsap.timeline({
      onComplete: () => onNext(selectedCountry)
    });

    // Slide content down
    tl.to(contentRef.current, {
      y: 100,
      opacity: 0,
      duration: 0.5,
      ease: "power2.in"
    });

    // Wipe covers screen
    tl.to(revealRef.current, {
      y: 0,
      duration: 0.8,
      ease: "power4.in"
    }, 0.3);
  };

  return (
    <OnboardingLayout>
      <DailyQuoteBox />
      <div
        ref={containerRef}
        className="relative h-full w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-400 via-yellow-300 to-orange-50"
      >
        {/* Reveal wipe overlay */}
        <div
          ref={revealRef}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-600 to-yellow-500 z-50"
        />

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
          <div className="absolute top-10 right-10 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-orange-300/20 rounded-full blur-3xl" />
        </div>

        {/* Main content - FULLSCREEN */}
        <div
          ref={contentRef}
          className="relative z-10 w-full h-full flex flex-col justify-center px-12 py-6"
        >
          {/* Chat Avatar */}
          <div ref={avatarRef} className="mb-6 flex justify-center">
            <ChatAvatar
              avatar={<GlobeAvatar />}
              message="Let's start your journey!"
            />
          </div>

          {/* Tip Box */}
          <div ref={tipRef} className="mb-8 max-w-3xl mx-auto">
            <TipBox>
              🌶️ Spicy truth: The world's hottest chili is Carolina Reaper at 2.2 million Scoville units!
            </TipBox>
          </div>

          {/* Title */}
          <h2
            ref={titleRef}
            className="text-center text-4xl font-black text-white mb-10 drop-shadow-lg"
          >
            Select your country to get personalized recipes and pricing
          </h2>

          {/* Country Cards - FULLSCREEN GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 max-w-5xl mx-auto w-full">
            {countries.map((country, index) => (
              <div
                key={country.id}
                ref={(el) => (countryRefs.current[index] = el)}
                onMouseEnter={() => handleCountryHover(index, true)}
                onMouseLeave={() => handleCountryHover(index, false)}
              >
                <SelectionCard
                  selected={selectedCountry === country.id}
                  onClick={() => setSelectedCountry(country.id)}
                  className="w-full flex items-center justify-center gap-6 py-10 px-8 transition-all duration-300 cursor-pointer bg-white hover:bg-grey-50"
                >
                  <span className="text-5xl">{country.flag}</span>
                  <p className="font-black text-gray-800 text-3xl">{country.name}</p>
                </SelectionCard>
              </div>
            ))}
          </div>

          {/* Progress & Navigation */}
          <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
            <Button
              variant="ghost"
              onClick={onBack}
              className="gap-3 text-xl px-8 py-8 bg-white/90 hover:bg-white hover:scale-105 transition-all text-grey-600 font-bold"
            >
              <ArrowLeft className="w-6 h-6" />
              Back
            </Button>

            <ProgressDots currentStep={1} totalSteps={8} />

            <Button
              variant="default"
              onClick={handleContinue}
              className="text-xl px-14 py-8 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 hover:scale-105 transition-all font-bold shadow-2xl"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default CountryStep;
