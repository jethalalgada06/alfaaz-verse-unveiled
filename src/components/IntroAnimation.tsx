
import { useState, useEffect } from 'react';

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation = ({ onComplete }: IntroAnimationProps) => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowText(true), 500);
    const timer2 = setTimeout(() => onComplete(), 3000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center z-50">
      <div className="text-center space-y-8">
        <div className="animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-serif text-white font-bold tracking-wider">
            Alfaaz
          </h1>
        </div>
        
        {showText && (
          <div className="animate-slide-up">
            <p className="text-xl md:text-2xl text-white/90 font-light tracking-wide">
              Where words come alive
            </p>
          </div>
        )}
        
        <div className="flex justify-center pt-8">
          <div className="w-1 h-16 bg-white/30 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default IntroAnimation;
