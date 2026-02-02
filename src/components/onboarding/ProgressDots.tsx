interface ProgressDotsProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressDots = ({ currentStep, totalSteps }: ProgressDotsProps) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;
        
        return (
          <div
            key={index}
            className={`progress-dot ${
              isActive ? "active" : isCompleted ? "completed" : "inactive"
            }`}
          />
        );
      })}
    </div>
  );
};

export default ProgressDots;
