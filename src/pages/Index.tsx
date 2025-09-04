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
      <section className="min-h-screen flex items-center justify-center hero-gradient relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge className="bg-white/20 text-white border-white/30 mb-8 inline-flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Trusted by 50,000+ Patients Worldwide
          </Badge>
          
          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
            Explore Expert
            <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Medical Opinions
            </span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Connect with certified medical specialists for trusted second opinions. 
            Make informed health decisions with confidence and peace of mind.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 hero-shadow px-8 py-4 text-lg font-semibold rounded-full"
              onClick={() => navigate('/register')}
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
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
          
          {/* Floating Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <Clock className="h-8 w-8 text-white mb-4 mx-auto" />
              <h3 className="text-white font-semibold mb-2">24-48 Hours</h3>
              <p className="text-white/80 text-sm">Quick response time</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <Award className="h-8 w-8 text-white mb-4 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Expert Doctors</h3>
              <p className="text-white/80 text-sm">15+ years experience</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <Shield className="h-8 w-8 text-white mb-4 mx-auto" />
              <h3 className="text-white font-semibold mb-2">100% Secure</h3>
              <p className="text-white/80 text-sm">Encrypted & protected</p>
            </div>
          </div>
        </div>
        
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Why Trust Us */}
      <section id="why-trust-us" className="py-24 bg-gradient-to-br from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              Why Choose EchoMed
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Trusted Healthcare Excellence
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Experience the difference with our world-class medical professionals and 
              cutting-edge secure platform designed for your peace of mind
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group text-center border-0 bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-500 hover:-translate-y-2 shadow-lg hover:shadow-2xl">
                <CardHeader className="pb-4">
                  <div className="mx-auto p-4 bg-gradient-to-br from-primary to-primary/80 rounded-2xl text-primary-foreground mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-muted/20 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-secondary/10 text-secondary border-secondary/20">
              Simple Process
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Your Journey to Better Health
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Get expert medical insights in just 4 simple steps - designed for convenience and security
            </p>
          </div>
          
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 transform -translate-y-1/2"></div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {steps.map((step, index) => (
                <div key={index} className="relative group">
                  <Card className="text-center border-0 bg-white/70 backdrop-blur-sm hover:bg-white transition-all duration-500 hover:-translate-y-4 shadow-lg hover:shadow-2xl">
                    <CardHeader className="pb-4">
                      <div className="relative">
                        <div className="mx-auto p-6 bg-gradient-to-br from-secondary to-secondary/80 rounded-3xl text-secondary-foreground mb-6 group-hover:scale-110 transition-transform duration-300">
                          {step.icon}
                        </div>
                        <div className="absolute -top-3 -right-3 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg">
                          {index + 1}
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold mb-2">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => navigate('/register')}
            >
              Begin Your Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
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