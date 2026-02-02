import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import OnboardingLayout from "@/components/layout/OnboardingLayout";
import ChatAvatar from "@/components/onboarding/ChatAvatar";
import TipBox from "@/components/onboarding/TipBox";
import ProgressDots from "@/components/onboarding/ProgressDots";
import DailyQuoteBox from "@/components/onboarding/DailyQuoteBox";
import gsap from "gsap";

interface MeasurementsStepProps {
  onNext: (data: { age: number; height: number; weight: number }) => void;
  onBack: () => void;
  initialData?: { age: number; height: number; weight: number };
}

const RulerAvatar = () => (
  <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center text-5xl shadow-2xl border-4 border-white">
    📏
  </div>
);

const MeasurementsStepNew = ({ onNext, onBack, initialData }: MeasurementsStepProps) => {
  const [formData, setFormData] = useState(
    initialData || { age: 25, height: 170, weight: 70 }
  );

  // Calculate BMI in real-time
  const calculateBMI = () => {
    const heightInMeters = formData.height / 100;
    const bmi = formData.weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "Underweight", color: "text-blue-600" };
    if (bmi < 25) return { label: "Normal", color: "text-green-600" };
    if (bmi < 30) return { label: "Overweight", color: "text-orange-600" };
    return { label: "Obese", color: "text-red-600" };
  };

  const bmi = parseFloat(calculateBMI());
  const bmiCategory = getBMICategory(bmi);

  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sliderRefs = useRef<(HTMLDivElement | null)[]>([]);
  const particlesRef = useRef<(HTMLDivElement | null)[]>([]);
  const ageDisplayRef = useRef<HTMLSpanElement>(null);
  const heightDisplayRef = useRef<HTMLSpanElement>(null);
  const weightDisplayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Split panel reveal - panels slide away from sides
      tl.to(leftPanelRef.current, {
        x: "-100%",
        duration: 1,
        ease: "power4.inOut"
      });

      tl.to(rightPanelRef.current, {
        x: "100%",
        duration: 1,
        ease: "power4.inOut"
      }, 0);

      // Background zoom
      tl.from(containerRef.current, {
        scale: 1.2,
        duration: 1,
        ease: "power3.out"
      }, 0.3);

      // Avatar bounces in
      tl.from(avatarRef.current, {
        scale: 0,
        rotation: 720,
        opacity: 0,
        duration: 1,
        ease: "elastic.out(1, 0.5)"
      }, 0.7);

      // Tip box slides from bottom
      tl.from(tipRef.current, {
        y: 100,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out"
      }, 0.9);

      // Title appears
      tl.from(titleRef.current, {
        scale: 0.5,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.7)"
      }, 1.1);

      // Sliders stagger in
      tl.from(sliderRefs.current, {
        x: -100,
        opacity: 0,
        stagger: 0.15,
        duration: 0.6,
        ease: "power3.out"
      }, 1.3);

      // Floating avatar (no rotation)
      gsap.to(avatarRef.current, {
        y: -12,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Pulsing glow
      gsap.to(contentRef.current, {
        boxShadow: "0 0 100px rgba(251, 146, 60, 0.3)",
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Animate particles
      particlesRef.current.forEach((particle, i) => {
        if (particle) {
          gsap.to(particle, {
            x: `random(-70, 70)`,
            y: `random(-70, 70)`,
            rotation: `random(0, 360)`,
            duration: `random(4, 6)`,
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

  // Animate value changes
  const animateValue = (ref: React.RefObject<HTMLSpanElement>, newValue: number) => {
    if (ref.current) {
      const currentValue = parseInt(ref.current.textContent || "0");
      gsap.from({ value: currentValue }, {
        value: newValue,
        duration: 0.5,
        ease: "power2.out",
        onUpdate: function () {
          if (ref.current) {
            ref.current.textContent = Math.round(this.targets()[0].value).toString();
          }
        }
      });
    }
  };

  const handleContinue = () => {
    const tl = gsap.timeline({
      onComplete: () => onNext(formData)
    });

    // Content fades and scales
    tl.to(contentRef.current, {
      scale: 0.9,
      opacity: 0,
      duration: 0.5,
      ease: "power2.in"
    });

    // Panels slide back
    tl.to(leftPanelRef.current, {
      x: 0,
      duration: 0.8,
      ease: "power4.in"
    }, 0.2);

    tl.to(rightPanelRef.current, {
      x: 0,
      duration: 0.8,
      ease: "power4.in"
    }, 0.2);
  };

  return (
    <OnboardingLayout>
      <DailyQuoteBox />
      <div
        ref={containerRef}
        className="relative h-full w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-300 via-pink-300 to-orange-50"
      >
        {/* Split panels */}
        <div
          ref={leftPanelRef}
          className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-orange-600 to-orange-500 z-50"
        />
        <div
          ref={rightPanelRef}
          className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-pink-600 to-pink-500 z-50"
        />

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(16)].map((_, i) => (
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
          <div className="absolute top-20 right-20 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl" />
        </div>

        {/* Main content */}
        <div
          ref={contentRef}
          className="relative z-10 w-full h-full flex flex-col justify-center px-12 py-6"
        >
          {/* Chat Avatar */}
          <div ref={avatarRef} className="mb-6 flex justify-center">
            <ChatAvatar
              avatar={<RulerAvatar />}
              message="Let's get your measurements!"
            />
          </div>

          {/* Tip Box */}
          <div ref={tipRef} className="mb-8 max-w-3xl mx-auto">
            <TipBox>
              🎯 Fun fact: Your ideal calorie intake depends on your age, height, and weight!
            </TipBox>
          </div>

          {/* Title */}
          <h2
            ref={titleRef}
            className="text-center text-4xl font-black text-white mb-10 drop-shadow-lg"
          >
            These details help us calculate your personalized nutrition plan
          </h2>

          {/* Measurement Sliders */}
          <div className="space-y-6 mb-10 max-w-4xl mx-auto w-full">
            {/* Age */}
            <div
              ref={(el) => (sliderRefs.current[0] = el)}
              className="bg-white/95 rounded-3xl p-8 shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <label className="text-lg font-semibold text-gray-700">Age</label>
                <span className="text-4xl font-black text-orange-600">
                  <span ref={ageDisplayRef}>{formData.age}</span>
                  <span className="text-lg font-normal text-gray-500 ml-2">years</span>
                </span>
              </div>
              <input
                type="range"
                min="16"
                max="80"
                value={formData.age}
                onChange={(e) => {
                  const newAge = parseInt(e.target.value);
                  setFormData({ ...formData, age: newAge });
                  animateValue(ageDisplayRef, newAge);
                }}
                className="w-full h-3 bg-orange-200 rounded-full appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>16</span>
                <span>80</span>
              </div>
            </div>

            {/* Height */}
            <div
              ref={(el) => (sliderRefs.current[1] = el)}
              className="bg-white/95 rounded-3xl p-8 shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <label className="text-lg font-semibold text-gray-700">Height</label>
                <span className="text-4xl font-black text-pink-600">
                  <span ref={heightDisplayRef}>{formData.height}</span>
                  <span className="text-lg font-normal text-gray-500 ml-2">cm</span>
                </span>
              </div>
              <input
                type="range"
                min="140"
                max="220"
                value={formData.height}
                onChange={(e) => {
                  const newHeight = parseInt(e.target.value);
                  setFormData({ ...formData, height: newHeight });
                  animateValue(heightDisplayRef, newHeight);
                }}
                className="w-full h-3 bg-pink-200 rounded-full appearance-none cursor-pointer accent-pink-500"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>140 cm</span>
                <span>220 cm</span>
              </div>
            </div>

            {/* Weight */}
            <div
              ref={(el) => (sliderRefs.current[2] = el)}
              className="bg-white/95 rounded-3xl p-8 shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <label className="text-lg font-semibold text-gray-700">Weight</label>
                <span className="text-4xl font-black text-orange-600">
                  <span ref={weightDisplayRef}>{formData.weight}</span>
                  <span className="text-lg font-normal text-gray-500 ml-2">kg</span>
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="150"
                value={formData.weight}
                onChange={(e) => {
                  const newWeight = parseInt(e.target.value);
                  setFormData({ ...formData, weight: newWeight });
                  animateValue(weightDisplayRef, newWeight);
                }}
                className="w-full h-3 bg-orange-200 rounded-full appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>40 kg</span>
                <span>150 kg</span>
              </div>
            </div>
          </div>

          {/* Progress & Navigation */}
          <div className="flex items-center justify-between max-w-4xl mx-auto w-full">
            <Button
              variant="ghost"
              onClick={onBack}
              className="gap-3 text-xl px-8 py-8 bg-white/90 hover:bg-white hover:scale-105 transition-all text-orange-600 font-bold"
            >
              <ArrowLeft className="w-6 h-6" />
              Back
            </Button>

            <ProgressDots currentStep={4} totalSteps={8} />

            <Button
              variant="default"
              onClick={handleContinue}
              className="text-xl px-14 py-8 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 hover:scale-105 transition-all font-bold shadow-2xl"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default MeasurementsStepNew;
