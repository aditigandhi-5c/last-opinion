import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, FileText, Stethoscope } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
const Questionnaire = () => {
  const navigate = useNavigate();
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [wantSubspecialist, setWantSubspecialist] = useState(false);
  const { toast } = useToast();
  const handleNext = () => {
    // Store questionnaire data
    const questionnaireData = {
      additionalInfo,
      wantSubspecialist
    };
    localStorage.setItem('questionnaireData', JSON.stringify(questionnaireData));
    // Also update current case.medical_background via backend if we have a case
    try {
      const caseIdRaw = localStorage.getItem('currentCaseId');
      const tokenRaw = localStorage.getItem('token');
      const caseId = caseIdRaw ? Number(caseIdRaw) : null;
      const token = tokenRaw ? tokenRaw.replace(/^\"|\"$/g, '').trim() : null;
      if (caseId && token && additionalInfo.trim()) {
        fetch(`http://127.0.0.1:8000/cases/${caseId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ medical_background: additionalInfo })
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
            <h1 className="text-3xl font-bold mb-4">Additional Information</h1>
            <p className="text-muted-foreground">
              Help our radiologists provide the most accurate second opinion.
            </p>
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2 text-primary">
                <FileText className="h-5 w-5" />
                Medical Background
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="additional-info">
                  Share more information about your condition or questions
                </Label>
                <Textarea id="additional-info" placeholder="Please describe your symptoms, concerns, or any specific questions you have about your scans. Include relevant medical history, current medications, or previous treatments if applicable." rows={6} value={additionalInfo} onChange={e => setAdditionalInfo(e.target.value)} className="resize-none" />
                <p className="text-xs text-muted-foreground">
                  The more details you provide, the more comprehensive your second opinion will be.
                </p>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-start space-x-3">
                  <Checkbox id="subspecialist" checked={wantSubspecialist} onCheckedChange={checked => setWantSubspecialist(checked as boolean)} />
                  <div className="space-y-1">
                    <Label htmlFor="subspecialist" className="flex items-center gap-2 cursor-pointer font-medium">
                      <Stethoscope className="h-4 w-4 text-secondary" />
                      Do you want a subspecialty radiologist to review?
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Subspecialty radiologists have additional specialized training in specific areas 
                      (e.g., neuroradiology, musculoskeletal, cardiac imaging). Recommended for complex cases.
                    </p>
                  </div>
                </div>
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
                <Button onClick={handleNext} className="flex-1 bg-primary hover:bg-primary/90">
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