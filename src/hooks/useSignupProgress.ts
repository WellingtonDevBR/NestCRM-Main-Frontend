
import { useState, useEffect } from 'react';

interface UseSignupProgressReturn {
  setupProgress: number;
  setSetupProgress: React.Dispatch<React.SetStateAction<number>>;
  setupStage: string;
  setSetupStage: React.Dispatch<React.SetStateAction<string>>;
  showSetupProgress: boolean;
  setShowSetupProgress: React.Dispatch<React.SetStateAction<boolean>>;
  startProgressSimulation: () => void;
}

export const useSignupProgress = (): UseSignupProgressReturn => {
  const [setupProgress, setSetupProgress] = useState(0);
  const [setupStage, setSetupStage] = useState("");
  const [showSetupProgress, setShowSetupProgress] = useState(false);

  const startProgressSimulation = () => {
    const stages = [
      "Creating your account...",
      "Setting up your tenant...",
      "Configuring your workspace...",
      "Checking tenant status...",
      "Preparing to redirect..."
    ];

    setSetupStage(stages[0]);
    setShowSetupProgress(true);
  };

  useEffect(() => {
    if (!showSetupProgress) return;

    const stages = [
      "Creating your account...",
      "Setting up your tenant...",
      "Configuring your workspace...",
      "Checking tenant status...",
      "Preparing to redirect..."
    ];

    let currentStage = 0;
    let progress = 0;

    const interval = setInterval(() => {
      if (progress >= 100) {
        clearInterval(interval);
        return;
      }

      progress += 2;
      setSetupProgress(progress);

      if (progress === 20 && currentStage < 1) {
        currentStage = 1;
        setSetupStage(stages[currentStage]);
      } else if (progress === 40 && currentStage < 2) {
        currentStage = 2;
        setSetupStage(stages[currentStage]);
      } else if (progress === 60 && currentStage < 3) {
        currentStage = 3;
        setSetupStage(stages[currentStage]);
      } else if (progress === 80 && currentStage < 4) {
        currentStage = 4;
        setSetupStage(stages[currentStage]);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [showSetupProgress]);

  return {
    setupProgress,
    setSetupProgress,
    setupStage,
    setSetupStage,
    showSetupProgress,
    setShowSetupProgress,
    startProgressSimulation
  };
};
