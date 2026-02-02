import { useRef, useEffect } from "react";
import gsap from "gsap";

const AnimatedCharacter = () => {
    const characterRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (!characterRef.current || !imgRef.current) return;

        // Pushup animation
        gsap.to(imgRef.current, {
            y: 30, // Go down
            scaleY: 0.9,
            duration: 0.8,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        });

        // Floating around the screen
        gsap.to(characterRef.current, {
            x: "random(-100, 100)",
            y: "random(-50, 50)",
            rotation: "random(-5, 5)",
            duration: 5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

    }, []);

    return (
        <div
            ref={characterRef}
            className="fixed bottom-12 left-12 z-50 pointer-events-none select-none"
        >
            <div className="relative group">
                {/* Speech Bubble */}
                <div className="absolute -top-16 -left-4 bg-white px-4 py-2 rounded-2xl shadow-xl border-2 border-green-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm font-black text-green-600">Go Broccoli! 🥦💪</p>
                    <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white border-r-2 border-b-2 border-green-200 rotate-45" />
                </div>

                <img
                    ref={imgRef}
                    src="/assets/characters/broccoli.png"
                    alt="Pushup Broccoli"
                    className="w-48 h-48 object-contain drop-shadow-2xl"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                    }}
                />
            </div>
        </div>
    );
};

export default AnimatedCharacter;
