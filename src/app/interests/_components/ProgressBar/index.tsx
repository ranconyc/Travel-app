export default function ProgressBar({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  const percentage = (currentStep / totalSteps) * 100;
  return (
    <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
      <div
        className="h-full bg-brand transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
