import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { useDummyNotifications } from "@/hooks/useDummyNotifications";
import { register as apiRegister } from "@/lib/api";
import { getFirebaseApp } from "@/lib/firebase";
import { ArrowLeft } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { sendSlackNotification } = useDummyNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('At least 8 characters');
    }
    if (password.length > 128) {
      errors.push('No more than 128 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('One uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('One lowercase letter');
    }
    if (!/\d/.test(password)) {
      errors.push('One number');
    }
    if (!/[@$!%*?&]/.test(password)) {
      errors.push('One special character (@$!%*?&)');
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate password requirements
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      setIsLoading(false);
      toast({
        title: "Password requirements not met",
        description: `Password must contain: ${passwordErrors.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setIsLoading(false);
      toast({
        title: "Passwords do not match",
        description: "Please ensure password and confirm password are the same.",
      });
      return;
    }

    try {
      // Register in BOTH Firebase AND Backend
      let firebaseSuccess = false;
      let backendSuccess = false;
      let firebaseError = null;
      let backendError = null;

      // 1. Try Firebase registration
      try {
        await getFirebaseApp();
        const { getAuth, createUserWithEmailAndPassword, signOut } = await import("firebase/auth");
        const auth = getAuth();
        await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        // Sign out to require explicit login step
        try { await signOut(auth); } catch {}
        firebaseSuccess = true;
      } catch (firebaseErr) {
        firebaseError = firebaseErr;
        console.log("Firebase registration failed:", firebaseErr);
      }

      // 2. Try Backend registration
      try {
        const result = await apiRegister({ email: formData.email, password: formData.password });
        backendSuccess = true;
      } catch (backendErr) {
        backendError = backendErr;
        console.log("Backend registration failed:", backendErr);
      }

      // 3. Handle results
      if (firebaseSuccess && backendSuccess) {
        // Both succeeded - perfect!
        setIsLoading(false);
        toast({ title: "Registration successful", description: "Account created successfully. Please log in to continue." });
        sendSlackNotification("#patient-registrations", `🆕 New signup (Both systems): ${formData.email}`);
        navigate('/login?next=/patient-details');
      } else if (firebaseSuccess || backendSuccess) {
        // At least one succeeded - still allow registration
        const systems = [];
        if (firebaseSuccess) systems.push("Firebase");
        if (backendSuccess) systems.push("Backend");
        
        setIsLoading(false);
        toast({ 
          title: "Registration successful", 
          description: `Account created in ${systems.join(" and ")}. Please log in to continue.` 
        });
        sendSlackNotification("#patient-registrations", `🆕 New signup (${systems.join(" + ")}): ${formData.email}`);
        navigate('/login?next=/patient-details');
      } else {
        // Both failed
        throw new Error("Registration failed in both systems. Please try again.");
      }
    } catch (err: any) {
      setIsLoading(false);
      toast({
        title: "Registration failed",
        description: String(err?.message || err),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
            <p className="text-muted-foreground">
              Join thousands who trust us with their health decisions
            </p>
          </div>

          {true ? (
            <Card className="medical-shadow">
              <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>
                  Create your account to begin your last opinion request
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="8+ chars, A-Z, a-z, 0-9, @$!%*?&"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Must contain: uppercase, lowercase, number, and special character
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    variant="hero"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Button 
                      variant="link" 
                      className="p-0 h-auto"
                      onClick={() => navigate('/login')}
                    >
                      Login here
                    </Button>
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="medical-shadow">
              <CardHeader>
                <CardTitle>Verify Your Email</CardTitle>
                <CardDescription>
                  We emailed a verification link to {formData.email}. Click it to verify your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full" 
                  variant="hero"
                  onClick={() => {
                    // Simulate verification complete and proceed to flow
                    localStorage.setItem('isAuthenticated', 'true');
                    toast({ title: 'Email verified', description: 'Welcome to EchoMed!' });
                    navigate('/patient-details');
                  }}
                >
                  I've verified my email
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => setVerificationSent(false)}
                >
                  Change email
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;