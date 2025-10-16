import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";
import { createPatient, optInWhatsApp } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, ArrowLeft, User, Phone, Mail, Calendar } from "lucide-react";

const PatientDetails = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    email: "",
    phone: ""
  });
  const [whatsappConsent, setWhatsappConsent] = useState(false);

  useEffect(() => {
    try {
      // Prefill from existing patient if available
      const existing = localStorage.getItem('patientDetails');
      if (existing) {
        const pd = JSON.parse(existing);
        setFormData(prev => ({
          ...prev,
          firstName: pd.firstName || prev.firstName,
          lastName: pd.lastName || prev.lastName,
          age: pd.age ? String(pd.age) : prev.age,
          gender: pd.gender || prev.gender,
          email: pd.email || prev.email,
          phone: pd.phone || prev.phone,
        }));
        return;
      }

      // Fallback: infer email from token
      const raw = localStorage.getItem('token');
      if (!raw) return;
      const token = raw.replace(/^\"|\"$/g, "").trim();
      const payload = JSON.parse(atob(token.split('.')[1] || ''));
      const emailFromToken = payload?.sub || '';
      if (emailFromToken) {
        setFormData(prev => ({ ...prev, email: emailFromToken }));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = async () => {
    try {
      if (!whatsappConsent) {
        throw new Error('Please agree to receive WhatsApp updates to continue.');
      }
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        age: Number(formData.age),
        gender: formData.gender,
        phone: formData.phone,
      };
      const saved = await createPatient(payload);
      // Fire WhatsApp opt-in automatically (best-effort)
      try { await optInWhatsApp(String(saved.phone || formData.phone)); } catch {}
      localStorage.setItem('patientDetails', JSON.stringify({ ...formData, id: saved.id }));
      toast({ title: 'Saved', description: `Patient #${saved.id} created.` });
      navigate('/upload');
    } catch (err: any) {
      toast({ title: 'Save failed', description: String(err?.message || err), variant: 'destructive' });
    }
  };

  const isFormValid = formData.firstName && formData.lastName && formData.age && 
                     formData.gender && formData.phone && whatsappConsent;

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Patient Details</h1>
            <p className="text-muted-foreground">
              Let's start with your basic information for a personalized last opinion.
            </p>
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2 text-primary">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="age"
                      type="number"
                      placeholder="Enter your age"
                      className="pl-10"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select onValueChange={(value) => handleInputChange('gender', value)}>
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

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Auto-filled from login"
                    className="pl-10"
                    value={formData.email}
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    className="pl-10"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
              </div>


              <div className="flex items-start gap-3">
                <input id="wa-consent" type="checkbox" className="mt-1"
                  checked={whatsappConsent}
                  onChange={(e) => setWhatsappConsent(e.target.checked)}
                />
                <div className="text-sm">
                  <Label htmlFor="wa-consent" className="cursor-pointer">
                    I agree to receive important updates about my case via WhatsApp to the phone number provided. This consent is required to proceed.
                  </Label>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!isFormValid}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
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

export default PatientDetails;