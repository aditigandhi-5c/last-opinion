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
  ArrowRight,
  Stethoscope
} from "lucide-react";
import heroImage from "@/assets/modern-consultation.jpg";
import floatingIcon from "@/assets/floating-stethoscope.png";

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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 gradient-primary rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 gradient-secondary rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 gradient-card rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      {/* Floating Navigation */}
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <nav className="glass-nav rounded-full px-8 py-4 transition-smooth">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="p-2 gradient-primary rounded-xl">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-white">EchoMed</span>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-white/90">
              <a href="#features" className="hover:text-white transition-smooth">Features</a>
              <a href="#how-it-works" className="hover:text-white transition-smooth">Process</a>
              <a href="#faqs" className="hover:text-white transition-smooth">FAQ</a>
            </div>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center gradient-hero relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-fade-in">
            <div className="glass-card rounded-3xl p-2 inline-flex items-center gap-3 mb-8">
              <div className="p-2 gradient-primary rounded-xl">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="text-white font-medium px-4">Trusted by 50,000+ Patients Worldwide</span>
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-bold text-white mb-8 leading-tight">
              Explore Expert
              <span className="block bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent animate-float">
                Medical Opinions
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
              Connect with certified medical specialists for trusted second opinions. 
              Make informed health decisions with confidence and peace of mind.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button 
                size="lg" 
                className="glass-card hover-glow text-white border-white/30 px-12 py-6 text-lg font-semibold rounded-full transition-bounce hover:scale-105"
                onClick={() => navigate('/register')}
              >
                Start Your Journey
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="glass-card border-white/30 text-white hover:bg-white/10 px-12 py-6 text-lg rounded-full transition-bounce hover:scale-105"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            </div>
          </div>
          
          {/* Floating Hero Image */}
          <div className="relative max-w-4xl mx-auto animate-float">
            <div className="glass-card rounded-3xl p-6 shadow-hero">
              <img 
                src={heroImage} 
                alt="Expert Medical Consultation" 
                className="rounded-2xl w-full shadow-primary"
              />
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 glass-card rounded-2xl p-4 animate-float delay-300">
              <div className="flex items-center space-x-3">
                <div className="flex -space-x-1">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-white font-medium">4.9/5 Rating</span>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -left-6 glass-card rounded-2xl p-4 animate-float delay-700">
              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-white" />
                <span className="text-white font-medium">50,000+ Patients</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating medical icon */}
        <div className="absolute top-1/4 right-20 hidden lg:block animate-float">
          <img src={floatingIcon} alt="Medical Icon" className="w-16 h-16 opacity-20" />
        </div>
        
        {/* Gradient orbs */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-20 left-20 w-32 h-32 gradient-primary rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 gradient-secondary rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-10 w-24 h-24 gradient-card rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="glass-card rounded-2xl p-3 inline-flex items-center gap-2 mb-8">
              <Award className="h-5 w-5 text-primary" />
              <span className="font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Why Choose EchoMed
              </span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold mb-8 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
              Trusted Healthcare Excellence
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Experience the difference with our world-class medical professionals and 
              cutting-edge secure platform designed for your peace of mind
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="glass-card rounded-3xl p-8 hover-glow transition-bounce hover:-translate-y-4 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="gradient-primary rounded-2xl p-4 w-fit mx-auto mb-6 group-hover:scale-110 transition-smooth shadow-primary">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-center">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-center">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 gradient-hero relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="glass-card rounded-2xl p-3 inline-flex items-center gap-2 mb-8">
              <FileText className="h-5 w-5 text-white" />
              <span className="font-medium text-white">Simple Process</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold mb-8 text-white">
              Your Journey to Better Health
            </h2>
            <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              Get expert medical insights in just 4 simple steps - designed for convenience and security
            </p>
          </div>
          
          <div className="relative">
            {/* Floating connection line */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-y-1/2"></div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {steps.map((step, index) => (
                <div key={index} className="group animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
                  <div className="glass-card rounded-3xl p-8 hover-glow transition-bounce hover:-translate-y-6 text-center">
                    <div className="relative mb-8">
                      <div className="gradient-card rounded-3xl p-6 w-fit mx-auto group-hover:scale-110 transition-smooth shadow-secondary">
                        {step.icon}
                      </div>
                      <div className="absolute -top-3 -right-3 gradient-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-primary">
                        {index + 1}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white">{step.title}</h3>
                    <p className="text-white/80 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-16">
            <Button 
              size="lg" 
              className="glass-card hover-glow text-white border-white/30 px-12 py-6 text-xl font-semibold rounded-full transition-bounce hover:scale-105"
              onClick={() => navigate('/register')}
            >
              Begin Your Consultation
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </div>
        </div>
        
        {/* Background effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 gradient-primary rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 gradient-secondary rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-24 gradient-card rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs" className="py-24 bg-gradient-to-br from-background to-muted/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-accent/10 text-accent border-accent/20">
              Common Questions
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Everything You Need to Know
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Find answers to the most common questions about our medical consultation service
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="group border-0 bg-white/60 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 hover:shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-start gap-4 group-hover:text-primary transition-colors">
                    <div className="p-2 bg-gradient-to-br from-accent to-accent/80 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed pl-16">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 hero-gradient relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge className="mb-8 bg-white/20 text-white border-white/30 inline-flex items-center gap-2">
            <Users className="h-4 w-4" />
            Join 50,000+ Satisfied Patients
          </Badge>
          
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8 leading-tight">
            Start Your Health Journey
            <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Today
            </span>
          </h2>
          
          <p className="text-xl lg:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Take the first step towards better health decisions with expert medical guidance you can trust
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
              onClick={() => navigate('/register')}
            >
              Get Started Now
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-full"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </div>
        </div>
        
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-white rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;