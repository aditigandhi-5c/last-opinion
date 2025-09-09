import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { 
  CheckCircle, 
  ArrowRight, 
  Clock, 
  FileText, 
  Bell,
  Home
} from "lucide-react";

const Success = () => {
  const navigate = useNavigate();

  const nextSteps = [
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Case Review",
      description: "Our medical experts are reviewing your case and medical history"
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Analysis in Progress", 
      description: "Detailed analysis and second opinion report preparation (1-2 business days)"
    },
    {
      icon: <Bell className="h-5 w-5" />,
      title: "Notification",
      description: "You'll receive WhatsApp and email notifications when your report is ready"
    }
  ];

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Message */}
          <div className="mb-8">
            <div className="mx-auto w-20 h-20 bg-accent rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            
            <h1 className="text-4xl font-bold mb-4">Thank You for Trusting Us!</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Your case has been successfully registered and payment confirmed.
            </p>
            
            <Badge className="bg-accent text-accent-foreground text-sm px-4 py-2">
              Case ID: #MC-2024-001
            </Badge>
          </div>

          {/* What Happens Next */}
          <Card className="medical-shadow mb-8 text-left">
            <CardHeader>
              <CardTitle>What Happens Next?</CardTitle>
              <CardDescription>
                Your journey to getting a trusted second opinion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {nextSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Important Information */}
          <Card className="bg-primary-light/20 border-primary/20 mb-8 text-left">
            <CardContent className="pt-6">
              <h4 className="font-medium mb-3">Important Information</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• You will receive your detailed second opinion report within 1-2 business days</li>
                <li>• Notifications will be sent via WhatsApp and email</li>
                <li>• You can track your case status in your dashboard</li>
                <li>• Our experts are now reviewing your medical information</li>
                <li>• For urgent queries, contact us at +91 98765 43210</li>
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="hero" 
              size="lg"
              onClick={() => navigate('/case/MC-2024-001')}
            >
              Go to My Case
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/')}
            >
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Button>
          </div>

          {/* Contact Support */}
          <div className="mt-12 p-6 bg-muted/30 rounded-lg">
            <h4 className="font-medium mb-2">Need Help?</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Our support team is available 24/7 to assist you with any questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
              <span>📧 support@5csecondopinion.com</span>
              <span className="hidden sm:inline">|</span>
              <span>📞 +91 98765 43210</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Success;