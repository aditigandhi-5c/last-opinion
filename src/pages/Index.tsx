import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";
import { 
  UserPlus, 
  Upload, 
  CreditCard, 
  FileText, 
  Shield, 
  Clock, 
  Award,
  Users,
  CheckCircle,
  Star,
  ArrowRight
} from "lucide-react";
import heroImage from "@/assets/hero-doctor.jpg";

const Index = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: <UserPlus className="h-8 w-8" />,
      title: "Register",
      description: "Create your secure account with basic information"
    },
    {
      icon: <Upload className="h-8 w-8" />,
      title: "Upload Files",
      description: "Share your medical history and reports securely"
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: "Pay ₹3000",
      description: "Secure payment for expert consultation"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Receive Report",
      description: "Get detailed second opinion within 24-48 hours"
    }
  ];

  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "100% Secure",
      description: "Your medical data is encrypted and protected"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Quick Response",
      description: "Get your second opinion within 24-48 hours"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Expert Doctors",
      description: "Certified specialists with 15+ years experience"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Trusted by 50,000+",
      description: "Patients who chose us for second opinions"
    }
  ];

  const faqs = [
    {
      question: "How long does it take to get a second opinion?",
      answer: "You'll receive your detailed second opinion report within 24-48 hours of submission."
    },
    {
      question: "Is my medical data secure?",
      answer: "Yes, all data is encrypted and follows strict medical privacy standards (HIPAA compliant)."
    },
    {
      question: "What types of cases do you handle?",
      answer: "We provide second opinions for all medical specialties including oncology, cardiology, neurology, and more."
    },
    {
      question: "Can I speak directly with the doctor?",
      answer: "The second opinion comes as a detailed written report. For direct consultation, additional charges may apply."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-gradient py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <Badge className="bg-white/20 text-white border-white/30 mb-6">
                Trusted by 50,000+ Patients
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Get Trusted 
                <span className="block text-secondary-light">Second Opinions</span>
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Expert medical consultations from certified specialists. 
                Make informed decisions about your health with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 hero-shadow"
                  onClick={() => navigate('/register')}
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-primary"
                  onClick={() => navigate('/login')}
                >
                  I Have an Account
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Trusted Medical Professional" 
                className="rounded-2xl hero-shadow w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl medical-shadow">
                <div className="flex items-center space-x-3">
                  <div className="flex -space-x-2">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-medium">4.9/5 Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Trust Us */}
      <section id="why-trust-us" className="py-20 bg-primary-light/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Trust 5C Second Opinion?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're committed to providing you with expert medical insights you can trust
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center medical-shadow hover:scale-105 transition-bounce">
                <CardHeader>
                  <div className="mx-auto p-3 bg-primary rounded-full text-primary-foreground mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get your second opinion in 4 simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="text-center medical-shadow hover:scale-105 transition-bounce">
                  <CardHeader>
                    <div className="mx-auto p-4 bg-secondary rounded-full text-secondary-foreground mb-4">
                      {step.icon}
                    </div>
                    <div className="absolute -top-3 -left-3 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
                {index < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-primary h-6 w-6" />
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              variant="hero" 
              size="lg" 
              onClick={() => navigate('/register')}
            >
              Start Your Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get answers to common questions about our service
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="medical-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground pl-8">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Get Your Second Opinion?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of patients who trust us with their most important health decisions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 hero-shadow"
              onClick={() => navigate('/register')}
            >
              Register Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-primary"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;