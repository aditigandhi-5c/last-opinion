import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { useDummyNotifications } from "@/hooks/useDummyNotifications";
import { 
  ArrowLeft, 
  Shield, 
  Clock, 
  CheckCircle, 
  CreditCard,
  FileText,
  Users
} from "lucide-react";

const Payment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { sendWhatsAppNotification, sendTeamNotifications } = useDummyNotifications();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);

    // Get patient data for notifications
    const patientData = JSON.parse(localStorage.getItem('patientDetails') || '{}');

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Payment Successful!",
        description: "Your case has been submitted to our medical experts.",
      });
      
      // Send thank you WhatsApp message after payment
      const patientName = `${patientData.firstName || 'Patient'} ${patientData.lastName || ''}`;
      setTimeout(() => {
        sendWhatsAppNotification(
          patientName,
          "Thank you for trusting us! You will see your report in your dashboard once ready."
        );
      }, 1000);
      
      // Send team notifications
      sendTeamNotifications(patientData);
      
      navigate('/success');
    }, 2000);
  };

  const features = [
    {
      icon: <FileText className="h-5 w-5" />,
      text: "Detailed written second opinion report"
    },
    {
      icon: <Users className="h-5 w-5" />,
      text: "Review by certified medical specialists"
    },
    {
      icon: <Clock className="h-5 w-5" />,
      text: "Report delivered within 1-2 business days"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      text: "100% secure and confidential"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/intake')}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Information
            </Button>
            <h1 className="text-3xl font-bold mb-2">Complete Your Payment</h1>
            <p className="text-muted-foreground">
              Secure payment to get your expert second opinion
            </p>
          </div>

          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="medical-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Order Summary
                </CardTitle>
                <CardDescription>
                  Review your second opinion consultation details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Second Opinion Consultation</span>
                  <span className="font-bold text-xl">₹3,000</span>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">What's Included:</h4>
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="text-accent">
                        {feature.icon}
                      </div>
                      <span className="text-sm">{feature.text}</span>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-primary">₹3,000</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="medical-shadow">
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>
                  Choose your preferred payment method
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-primary-light/20 p-4 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <span className="font-medium">Credit/Debit Card, UPI, Net Banking</span>
                    </div>
                    <Badge variant="secondary">Recommended</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Secure payment powered by Razorpay. All major cards and UPI accepted.
                  </p>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="bg-accent-light/20 border-accent/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">Secure Transaction</h4>
                    <p className="text-sm text-muted-foreground">
                      Your payment is processed securely. We use industry-standard encryption 
                      to protect your financial information. Your medical data remains 
                      confidential and is handled according to medical privacy standards.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pay Button */}
            <Button 
              variant="hero" 
              size="lg" 
              className="w-full"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Pay ₹3,000 Now
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By proceeding with payment, you agree to our Terms of Service and Privacy Policy. 
              You will receive your second opinion report within 1-2 business days of successful payment.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Payment;