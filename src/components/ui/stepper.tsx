import { cn } from "@/lib/utils";
import { CheckCircle, Circle } from "lucide-react";

interface StepperProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export const Stepper = ({ steps, currentStep, className }: StepperProps) => {
  return (
    <div className={cn("flex items-center justify-between w-full mb-8", className)}>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-smooth",
              index < currentStep 
                ? "bg-accent border-accent text-accent-foreground" 
                : index === currentStep
                ? "bg-primary border-primary text-primary-foreground"
                : "bg-background border-muted-foreground/30 text-muted-foreground"
            )}>
              {index < currentStep ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            <span className={cn(
              "mt-2 text-xs font-medium text-center max-w-20",
              index <= currentStep ? "text-foreground" : "text-muted-foreground"
            )}>
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={cn(
              "flex-1 h-0.5 mx-4 transition-smooth",
              index < currentStep ? "bg-accent" : "bg-muted"
            )} />
          )}
        </div>
      ))}
    </div>
  );
};