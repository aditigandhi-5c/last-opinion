import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Upload, MessageSquare, Search, FileText, CreditCard } from "lucide-react";

interface SlideShowStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  image?: string;
}

const WorkflowSlideshow = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: SlideShowStep[] = [
    {
      id: "add-details",
      title: "Add Details",
      description: "Share your medical information and symptoms with our secure platform",
      icon: <MessageSquare className="h-12 w-12" />,
    },
    {
      id: "upload-scan",
      title: "Upload Scans",
      description: "Securely upload your DICOM files and medical images",
      icon: <Upload className="h-12 w-12" />,
    },
    {
      id: "ask-questions",
      title: "Ask Specific Questions",
      description: "Submit detailed questions about your condition for expert analysis",
      icon: <MessageSquare className="h-12 w-12" />,
    },
    {
      id: "browse-radiologists",
      title: "Browse Radiologists",
      description: "Choose from our network of board-certified specialist radiologists",
      icon: <Search className="h-12 w-12" />,
    },
    {
      id: "secure-payment",
      title: "Secure Payment",
      description: "Complete your order with our encrypted payment system",
      icon: <CreditCard className="h-12 w-12" />,
    },
    {
      id: "view-report",
      title: "View Full Report",
      description: "Receive your comprehensive second opinion report within 48 hours",
      icon: <FileText className="h-12 w-12" />,
    },
  ];

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [steps.length]);

  const goToStep = (index: number) => {
    setCurrentStep(index);
  };

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % steps.length);
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Main Display */}
      <div className="relative">
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-muted/30 min-h-[400px]">
          <CardContent className="p-12">
            <div className="text-center space-y-8">
              {/* Icon */}
              <div className="mx-auto w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center text-primary">
                {steps[currentStep].icon}
              </div>
              
              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-foreground">
                  {steps[currentStep].title}
                </h3>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  {steps[currentStep].description}
                </p>
              </div>

              {/* Step Counter */}
              <div className="flex items-center justify-center space-x-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Step {currentStep + 1} of {steps.length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Arrows */}
        <button
          onClick={prevStep}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-muted/50 transition-colors"
        >
          <ChevronLeft className="h-6 w-6 text-muted-foreground" />
        </button>
        
        <button
          onClick={nextStep}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-muted/50 transition-colors"
        >
          <ChevronRight className="h-6 w-6 text-muted-foreground" />
        </button>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-center mt-8 space-x-3">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => goToStep(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentStep 
                ? 'bg-primary' 
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
          />
        ))}
      </div>

      {/* Step Labels */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
        {steps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => goToStep(index)}
            className={`p-3 rounded-lg text-center transition-all ${
              index === currentStep
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="text-xs font-medium truncate">
              {step.title}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WorkflowSlideshow;