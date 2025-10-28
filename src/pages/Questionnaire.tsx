import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
const Questionnaire = () => {
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Always start with empty fields for privacy/UX
    // (Previous data is stored in backend via case.medical_background)
    setSymptoms("");
    setAdditionalInfo("");
  }, []);
  const handleNext = () => {
    // Store questionnaire data
    const questionnaireData = {
      symptoms,
      additionalInfo
    };
    localStorage.setItem('questionnaireData', JSON.stringify(questionnaireData));
    // Also update current case.medical_background via backend if we have a case
    try {
      const caseIdRaw = localStorage.getItem('currentCaseId');
      const tokenRaw = localStorage.getItem('token');
      const caseId = caseIdRaw ? Number(caseIdRaw) : null;
      const token = tokenRaw ? tokenRaw.replace(/^\"|\"$/g, '').trim() : null;
      if (caseId && token && (symptoms.trim() || additionalInfo.trim())) {
        fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://api.lastopinion.in'}/cases/${caseId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ 
            symptoms: symptoms.trim() || null,
            medical_background: additionalInfo.trim() || null
          })
        }).catch(() => {});
      }
    } catch (e) {
      // ignore network errors; UI still proceeds
    }
    navigate('/payment');
  };
  return <div className="min-h-screen bg-background animate-fade-in">
      <Header />
      
      {/* Ensure content starts below the fixed header on small screens too */}
      <div className="container mx-auto px-4 pt-24 pb-12 md:pt-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Tell Us About Your Health</h1>
            <p className="text-muted-foreground">
              Share your medical history and questions to help our radiologists provide the most accurate last opinion.
            </p>
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2 text-primary">
                <FileText className="h-5 w-5" />
                Medical History & Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="symptoms">
                  What symptoms or condition are you experiencing? *
                </Label>
                <Textarea 
                  id="symptoms" 
                  placeholder="Describe your symptoms or the medical condition you're concerned about" 
                  rows={3} 
                  value={symptoms} 
                  onChange={e => setSymptoms(e.target.value)} 
                  className="resize-none" 
                />
                <p className="text-xs text-muted-foreground">
                  Please describe your main symptoms or the condition you're seeking a last opinion for.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional-info">
                  Medical History & Questions *
                </Label>
                <Textarea 
                  id="additional-info" 
                  placeholder="Please share your medical history, current medications, previous treatments, and any specific questions you have about your scans or condition." 
                  rows={6} 
                  value={additionalInfo} 
                  onChange={e => setAdditionalInfo(e.target.value)} 
                  className="resize-none" 
                />
                <p className="text-xs text-muted-foreground">
                  Include any relevant medical history, medications, treatments, and specific questions you'd like our radiologists to address.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">What happens next?</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Your case will be assigned to an expert radiologist</li>
                  <li>• Comprehensive review of your scans and medical information</li>
                  <li>• Detailed written report within 24 hours</li>
                  <li>• Secure delivery to your dashboard.</li>
                </ul>
              </div>

              <div className="flex gap-4 pt-4">
                <Button variant="outline" onClick={() => navigate('/upload')} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button 
                  onClick={handleNext} 
                  disabled={!symptoms.trim() || !additionalInfo.trim()}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Continue to Payment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>;
};
export default Questionnaire;