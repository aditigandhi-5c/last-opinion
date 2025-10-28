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
import { createRazorpayOrder, openRazorpayCheckout } from "@/lib/razorpay";
// Frontend no longer sends Slack; backend posts to Slack on payment
const USE_DUMMY_PAYMENT = false; // Toggle to simulate payment without backend

const PaymentPage = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      const ensureToken = () => {
        const tokenRaw = localStorage.getItem('token');
        return tokenRaw ? tokenRaw.replace(/^\"|\"$/g, '').trim() : null;
      };
      const token = ensureToken();
      if (!token) throw new Error('Missing session. Please login again.');

      const ensureOwnedCase = async (): Promise<number> => {
        const getMe = async () => {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001'}/patients/me`, { headers: { Authorization: `Bearer ${token}` } });
          if (res.status === 404) throw new Error('No patient found. Please complete patient details.');
          if (!res.ok) throw new Error('Unable to fetch patient.');
          const me = await res.json();
          return Number(me?.id);
        };
        const patientId = await getMe();
        const existing = localStorage.getItem('currentCaseId');
        if (existing) return Number(existing);
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001'}/cases`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ patient_id: patientId }),
        });
        const data = await res.json().catch(() => undefined);
        if (!res.ok) throw new Error((data && (data.detail || data.message)) || 'Failed to create case');
        const newId = Number(data.id);
        localStorage.setItem('currentCaseId', String(newId));
        return newId;
      };

      let case_id = (() => { const raw = localStorage.getItem('currentCaseId'); return raw ? Number(raw) : NaN; })();
      if (!case_id || Number.isNaN(case_id)) case_id = await ensureOwnedCase();

      if (USE_DUMMY_PAYMENT) {
        // Simulate success without calling backend, but ensure case exists
        await new Promise((r) => setTimeout(r, 600));
        // Try fire WhatsApp test from backend (non-blocking)
        try {
          const meRes = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001'}/patients/me`, { headers: { Authorization: `Bearer ${token}` } });
          const me = meRes.ok ? await meRes.json() : null;
          const patientName = me ? `${me.first_name} ${me.last_name}`.trim() : 'Patient';
          const phone = me?.phone ? String(me.phone) : '';
          const qs = new URLSearchParams({ name: patientName, phone, case_id: String(case_id) }).toString();
          fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001'}/test-whatsapp?${qs}`).catch(() => {});
        } catch {}
        toast({
          title: 'Payment Successful!',
          description: 'Dummy payment processed. Your case will be handled shortly.'
        });
        return navigate('/dashboard');
      }

      // Create Razorpay order
      const orderData = await createRazorpayOrder(case_id, 3000);
      
      // Open Razorpay checkout
      await openRazorpayCheckout(
        orderData,
        // Success callback
        (paymentResult) => {
          toast({
            title: 'Payment Successful!',
            description: 'We have started processing your case. You will receive your report shortly.'
          });
          navigate('/dashboard');
        },
        // Error callback
        (error) => {
          console.error('Payment error:', error);
          const errorMessage = error?.message || error?.detail || String(error) || 'Payment could not be completed. Please try again.';
          toast({
            title: 'Payment Failed',
            description: errorMessage,
            variant: 'destructive'
          });
        }
      );

    } catch (e: any) {
      toast({ title: 'Payment error', description: String(e?.message || e), variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };
  return <div className="min-h-screen bg-background animate-fade-in">
      <Header />

      {/* Ensure content starts below the fixed header on small screens too */}
      <div className="container mx-auto px-4 pt-24 pb-12 md:pt-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Complete Your Order</h1>
            <p className="text-muted-foreground">
              Secure payment for your expert medical last opinion.
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
              Your expert last opinion report will be delivered within 1-2 business days to your dashboard.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>;
};
export default PaymentPage;