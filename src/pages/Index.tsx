
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IntroAnimation from '@/components/IntroAnimation';

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  const navigate = useNavigate();

  const handleIntroComplete = () => {
    setShowIntro(false);
    navigate('/auth');
  };

  if (showIntro) {
    return <IntroAnimation onComplete={handleIntroComplete} />;
  }

  return null;
};

export default Index;
