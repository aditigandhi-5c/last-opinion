import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { login as apiLogin, exchangeFirebaseIdToken } from "@/lib/api";
import { getFirebaseApp } from "@/lib/firebase";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  // Keep login simple: do not auto-redirect away from login

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Try Firebase-first to sign in, then exchange ID token for backend JWT
      try {
        await getFirebaseApp();
        const { getAuth, signInWithEmailAndPassword } = await import("firebase/auth");
        const auth = getAuth();
        const cred = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        const idToken = await cred.user.getIdToken();
        await exchangeFirebaseIdToken(idToken);
      } catch (firebaseErr) {
        // Fallback to existing API login so flow never breaks
        await apiLogin({ email: formData.email, password: formData.password });
      }
      setIsLoading(false);
      toast({ title: "Login Successful!", description: `You're now signed in.` });
      localStorage.setItem('isAuthenticated', 'true');
      const url = new URL(window.location.href);
      const next = url.searchParams.get('next');
      navigate(next || '/dashboard');
    } catch (err: any) {
      setIsLoading(false);
      toast({ title: "Login failed", description: String(err?.message || err), variant: "destructive" });
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
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">
              Login to continue your medical consultation
            </p>
          </div>

          <Card className="medical-shadow">
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
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
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  variant="hero"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>

              <div className="mt-6 text-center space-y-4">
                <Button 
                  variant="link" 
                  className="text-sm"
                  onClick={async () => {
                    try {
                      await getFirebaseApp();
                      const { getAuth, sendPasswordResetEmail } = await import("firebase/auth");
                      const auth = getAuth();
                      await sendPasswordResetEmail(auth, formData.email || "");
                      toast({
                        title: "Reset email sent",
                        description: "Check your email for password reset instructions.",
                      });
                    } catch (error: any) {
                      toast({
                        title: "Reset failed",
                        description: error.message || "Failed to send reset email. Please try again.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  Forgot your password?
                </Button>
                
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto"
                    onClick={() => navigate('/register')}
                  >
                    Register here
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;