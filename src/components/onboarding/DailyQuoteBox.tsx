import { useState } from "react";

const dailyQuotes = [
    "Your health is an investment, not an expense",
    "Small steps every day lead to big changes",
    "You don’t have to be extreme, just consistent!",
    "Believe in yourself today! ✨",
    "Health isn’t about perfection, it’s about progress",
    "A healthy outside starts from the inside",
    "You've got this! 🚀",
];

const DailyQuoteBox = () => {
    const [quote] = useState(() => {
        // Get a consistent quote for the day
        const today = new Date().getDate();
        return dailyQuotes[today % dailyQuotes.length];
    });

    return (
        <div className="fixed top-24 right-8 z-30 max-w-sm">
            <div className="bg-gradient-to-br from-white to-yellow-50 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border-4 border-yellow-300 relative overflow-hidden animate-pulse">
                {/* Background decoration */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-200 rounded-full opacity-30 blur-2xl" />
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-orange-200 rounded-full opacity-30 blur-xl" />

                {/* Cartoon character and quote */}
                <div className="relative flex items-start gap-4">
                    <div className="flex-shrink-0">
                        {/* Cute cartoon character mascot */}
                        <div className="relative w-20 h-20">
                            <img
                                src="/assets/characters/mascot.png"
                                alt="Cute mascot"
                                className="w-full h-full rounded-full shadow-lg border-4 border-white object-cover bg-orange-100"
                                onError={(e) => {
                                    // Fallback to emoji if image doesn't load
                                    e.currentTarget.style.display = 'none';
                                    if (e.currentTarget.nextElementSibling) {
                                        (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                                    }
                                }}
                            />
                            <div
                                className="w-full h-full rounded-full bg-gradient-to-br from-cyan-300 via-blue-300 to-yellow-200 flex items-center justify-center text-4xl shadow-lg border-4 border-white absolute top-0 left-0"
                                style={{ display: 'none' }}
                            >
                                😊
                            </div>
                        </div>
                    </div>

                    {/* Quote */}
                    <div className="flex-1">
                        <p className="text-xs font-black text-yellow-600 uppercase tracking-wider mb-2">
                            💡 Daily Motivation
                        </p>
                        <p className="text-lg font-black text-gray-800 leading-tight">
                            {quote}
                        </p>
                    </div>
                </div>

                {/* Decorative sparkles */}
                <div className="absolute top-2 left-2 text-yellow-400 text-xl animate-pulse">✨</div>
                <div className="absolute bottom-3 right-3 text-orange-400 text-sm animate-pulse" style={{ animationDelay: '0.15s' }}>⭐</div>
            </div>
        </div>
    );
};

export default DailyQuoteBox;
