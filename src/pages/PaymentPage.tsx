import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, CreditCard, Shield, CheckCircle, Clock, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDummyNotifications } from "@/hooks/useDummyNotifications";
const PaymentPage = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    sendPatientConfirmations,
    sendTeamNotifications
  } = useDummyNotifications();
  const [isProcessing, setIsProcessing] = useState(false);
  const handlePayment = async () => {
    setIsProcessing(true);

    // Get patient data for notifications
    const patientData = JSON.parse(localStorage.getItem('patientDetails') || '{}');

    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Payment Successful!",
        description: "Your second opinion request has been submitted. You'll receive your report within 1-2 business days."
      });

      // Send thank you WhatsApp message after payment
      const {
        sendWhatsAppNotification
      } = useDummyNotifications();
      const patientName = `${patientData.firstName || 'Patient'} ${patientData.lastName || ''}`;
      setTimeout(() => {
        sendWhatsAppNotification(patientName, "Thank you for trusting us! You will see your report in your dashboard once ready.");
      }, 1000);

      // Send team notifications
      sendTeamNotifications(patientData);
      navigate('/dashboard');
    }, 2000);
  };
  return <div className="min-h-screen bg-background animate-fade-in">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Complete Your Order</h1>
            <p className="text-muted-foreground">
              Secure payment for your expert medical second opinion.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="text-primary">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">Radiology Second Opinion</h3>
                        <p className="text-sm text-muted-foreground">
                          Expert review by board-certified radiologist
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl">₹3,000</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold">Included in your order:</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Comprehensive scan analysis</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Detailed written report</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Expert radiologist review</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>1-2 business day delivery</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>HIPAA-compliant security</span>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Total</span>
                      <span>₹3,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-2">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-xs font-medium">1-2 Business Days</p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-secondary/10 rounded-full w-fit mx-auto mb-2">
                    <Award className="h-6 w-6 text-secondary" />
                  </div>
                  <p className="text-xs font-medium">Expert Radiologists</p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-accent/10 rounded-full w-fit mx-auto mb-2">
                    <Shield className="h-6 w-6 text-accent" />
                  </div>
                  <p className="text-xs font-medium">100% Secure</p>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-secondary/5">
                  <CardTitle className="flex items-center gap-2 text-secondary">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-lg mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm opacity-90">Recommended Payment</p>
                        <h3 className="text-xl font-bold">Secure Online Payment</h3>
                      </div>
                      <Badge className="bg-white/20 text-white border-white/30">
                        Most Popular
                      </Badge>
                    </div>
                    <p className="text-sm opacity-90">
                      Fast, secure, and encrypted payment processing with instant confirmation.
                    </p>
                  </div>
                  
                  <Button onClick={handlePayment} disabled={isProcessing} className="w-full bg-primary hover:bg-primary/90 text-lg py-6" size="lg">
                    {isProcessing ? <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing Payment...
                      </> : <>
                        Pay ₹3,000 Securely
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>}
                  </Button>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-green-800 mb-1">Secure Transaction</p>
                      <p className="text-green-700">
                        Your payment is protected by bank-grade encryption. We never store your payment information.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => navigate('/questionnaire')} className="flex-1" disabled={isProcessing}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </div>
            </div>
          </div>

          {/* Terms and Delivery Info */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              By proceeding with payment, you agree to our{" "}
              <a href="#" className="text-primary hover:underline">Terms of Service</a> and{" "}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
            </p>
            <p className="mt-2">
              Your expert second opinion report will be delivered within 1-2 business days to your dashboard.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>;
};
export default PaymentPage;