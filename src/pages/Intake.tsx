import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stepper } from "@/components/ui/stepper";
import { FileUpload } from "@/components/ui/file-upload";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Intake = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Demographics
    dateOfBirth: "",
    gender: "",
    city: "",
    pinCode: "",
    
    // Medical History
    medicalHistory: "",
    currentMedications: "",
    allergies: "",
    
    // Files
    medicalReports: [] as File[],
    priorReports: [] as File[],
    dicomFiles: [] as File[]
  });

  const steps = ["Demographics", "Medical History", "Prior Reports", "DICOM Files"];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - save and continue
      toast({
        title: "Information Saved!",
        description: "Your medical information has been securely saved. Proceeding to payment.",
      });
      navigate('/payment');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="Enter your city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pinCode">PIN Code</Label>
                <Input
                  id="pinCode"
                  type="text"
                  placeholder="Enter your PIN code"
                  value={formData.pinCode}
                  onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="medicalHistory">Medical History</Label>
              <Textarea
                id="medicalHistory"
                placeholder="Please describe your current condition, symptoms, and any relevant medical history..."
                rows={5}
                value={formData.medicalHistory}
                onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="medications">Current Medications</Label>
              <Textarea
                id="medications"
                placeholder="List all medications you are currently taking, including dosages..."
                rows={3}
                value={formData.currentMedications}
                onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="allergies">Known Allergies</Label>
              <Textarea
                id="allergies"
                placeholder="List any known allergies to medications, foods, or other substances..."
                rows={2}
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <FileUpload
              label="Medical Reports"
              description="Upload your recent medical reports, lab results, prescriptions, etc. (PDF, JPG, PNG)"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              multiple={true}
              onFilesSelected={(files) => setFormData({ ...formData, medicalReports: files })}
            />
            
            <FileUpload
              label="Prior Consultation Reports"
              description="Upload any previous consultation reports or second opinions you may have (PDF, JPG, PNG)"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              multiple={true}
              onFilesSelected={(files) => setFormData({ ...formData, priorReports: files })}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <FileUpload
              label="DICOM Files"
              description="Upload your CT scans, MRI, X-rays, or other imaging files. DICOM format preferred but not required."
              accept=".dcm,.jpg,.jpeg,.png,.pdf"
              multiple={true}
              onFilesSelected={(files) => setFormData({ ...formData, dicomFiles: files })}
            />
            
            <div className="bg-primary-light/20 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Upload Guidelines:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Maximum file size: 50MB per file</li>
                <li>• Supported formats: DICOM (.dcm), PDF, JPG, PNG</li>
                <li>• If you have CD/DVD with scans, you can upload individual images</li>
                <li>• Ensure images are clear and readable</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            <h1 className="text-3xl font-bold mb-2">Medical Information</h1>
            <p className="text-muted-foreground">
              Please provide your medical information to help our experts give you the best second opinion
            </p>
          </div>

          <Stepper steps={steps} currentStep={currentStep} />

          <Card className="medical-shadow">
            <CardHeader>
              <CardTitle>{steps[currentStep]}</CardTitle>
              <CardDescription>
                {currentStep === 0 && "Basic demographic information"}
                {currentStep === 1 && "Your current medical condition and history"}
                {currentStep === 2 && "Upload your medical reports and documents"}
                {currentStep === 3 && "Upload imaging files (CT, MRI, X-rays, etc.)"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderStepContent()}
              
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                
                <Button
                  variant="hero"
                  onClick={handleNext}
                >
                  {currentStep === steps.length - 1 ? "Save & Continue" : "Next"}
                  {currentStep !== steps.length - 1 && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Intake;