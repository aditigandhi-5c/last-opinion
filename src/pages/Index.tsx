import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";
import { 
  Shield, 
  Clock, 
  Award,
  Upload,
  FileText,
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  Stethoscope,
  Heart,
  Zap
} from "lucide-react";
import WorkflowSlideshow from "@/components/WorkflowSlideshow";
import ChatBot from "@/components/ChatBot";
import DoctorShowcase from "@/components/DoctorShowcase";

import medicalCareBg from "@/assets/medical-care-bg.jpg";
import medicalReportBg from "@/assets/medical-report-bg.jpg";
import medicalTechBg from "@/assets/medical-tech-bg.jpg";
import patientTestimonial from "@/assets/patient-testimonial-indian.jpg";

const Index = () => {
  const navigate = useNavigate();

  const trustPoints = [
    {
      icon: <Award className="h-6 w-6" />,
      title: "Reviewed by world-class radiologists",
      description: "Board-certified subspecialty experts with 15+ years experience"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Accurate results within 48 hours",
      description: "Fast turnaround without compromising quality"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Trusted by thousands of patients",
      description: "Over 10,000 patients have found clarity through our platform"
    }
  ];

  const testimonials = [
    {
      text: "The clarity I needed when everything felt uncertain.",
      author: "Sarah M.",
      rating: 5
    },
    {
      text: "Finally, answers that made sense. Life-changing.",
      author: "David K.",
      rating: 5
    },
    {
      text: "Peace of mind when I needed it most.",
      author: "Maria L.",
      rating: 5
    },
    {
      text: "Expert insight that changed my treatment path.",
      author: "John D.",
      rating: 5
    },
    {
      text: "Professional, fast, and incredibly thorough.",
      author: "Lisa R.",
      rating: 5
    },
    {
      text: "The second opinion that saved my life.",
      author: "Michael T.",
      rating: 5
    },
    {
      text: "Clarity in confusion, hope in uncertainty.",
      author: "Emma S.",
      rating: 5
    },
    {
      text: "World-class expertise, caring approach.",
      author: "Robert H.",
      rating: 5
    },
    {
      text: "The answers I desperately needed.",
      author: "Jennifer W.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            When Doubt Ends, Healing Begins.
          </h1>
          
          <p className="text-xl lg:text-2xl mb-12 max-w-4xl mx-auto opacity-90">
            Get the most accurate interpretation of your scans, guided by subspecialty experts 
            who care about your clarity and peace of mind.
          </p>
          
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg font-semibold"
            onClick={() => navigate('/patient-details')}
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Why Choose Us Section with Three Service Boxes */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-start mb-16">
            <div className="flex-1">
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                The Last Opinion<br />You'll Ever Need.
              </h2>
            </div>
            <div className="flex-1 ml-8">
              <p className="text-xl text-muted-foreground">
                Our radiologists provide comprehensive, expert second opinions using cutting-edge technology to give you the clarity you deserve.
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="relative h-80 overflow-hidden group border-0 shadow-elegant">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${medicalCareBg})` }}
              />
              <div className="absolute inset-0 bg-primary/80" />
              <CardContent className="relative z-10 p-8 h-full flex flex-col justify-center text-white">
                <Heart className="h-12 w-12 mb-6 text-white" />
                <h3 className="text-2xl font-bold mb-4">Expert Care</h3>
                <p className="text-white/90">
                  Board-certified radiologists with decades of experience in medical imaging analysis
                </p>
              </CardContent>
            </Card>

            <Card className="relative h-80 overflow-hidden group border-0 shadow-elegant">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${medicalReportBg})` }}
              />
              <div className="absolute inset-0 bg-primary/80" />
              <CardContent className="relative z-10 p-8 h-full flex flex-col justify-center text-white">
                <FileText className="h-12 w-12 mb-6 text-white" />
                <h3 className="text-2xl font-bold mb-4">Detailed Reports</h3>
                <p className="text-white/90">
                  Comprehensive analysis with clear explanations you can understand and trust
                </p>
              </CardContent>
            </Card>

            <Card className="relative h-80 overflow-hidden group border-0 shadow-elegant">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${medicalTechBg})` }}
              />
              <div className="absolute inset-0 bg-primary/80" />
              <CardContent className="relative z-10 p-8 h-full flex flex-col justify-center text-white">
                <Zap className="h-12 w-12 mb-6 text-white" />
                <h3 className="text-2xl font-bold mb-4">Fast Results</h3>
                <p className="text-white/90">
                  Get your expert second opinion within 24-48 hours, not weeks
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Workflow Slideshow Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
              Ensuring You Always
            </h2>
            <p className="text-2xl lg:text-3xl font-light text-muted-foreground">
              Get the Full Picture
            </p>
          </div>
          
          <WorkflowSlideshow />
        </div>
      </section>

      {/* Precision Starts with The Right Doctor Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
              Precision Starts with
            </h2>
            <p className="text-2xl lg:text-3xl font-light text-muted-foreground">
              The Right Doctor
            </p>
          </div>

          <DoctorShowcase />
        </div>
      </section>

      {/* Statistics Section - DocPanel Style */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-start mb-16">
            <div className="flex-1">
              <h2 className="text-4xl lg:text-6xl font-light text-foreground leading-tight">
                An Accurate Diagnosis<br />
                <span className="font-bold">Changes Everything</span>
              </h2>
            </div>
            <div className="flex-1 ml-8 flex flex-col justify-center">
              <p className="text-xl text-muted-foreground mb-8">
                We give you the final, trusted clarity that ends doubt and helps you move forward with confidence in your treatment.
              </p>
              <Button 
                size="lg" 
                className="bg-primary text-white hover:bg-primary/90 px-8 py-4 text-lg font-semibold w-fit"
                onClick={() => navigate('/patient-details')}
              >
                Get Started
              </Button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="relative h-80 overflow-hidden border-0 bg-slate-800 text-white">
              <CardContent className="p-8 h-full flex flex-col justify-between">
                <div className="w-12 h-12 bg-emerald-400 rounded-full flex items-center justify-center mb-6">
                  <Shield className="h-6 w-6 text-slate-800" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-6 leading-tight">
                    12 million patients are misdiagnosed every year
                  </h3>
                  <p className="text-white/80 text-lg">
                    A missed detail could mean the wrong treatment—or no treatment at all.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="relative h-80 overflow-hidden border-0 bg-slate-800 text-white">
              <CardContent className="p-8 h-full flex flex-col justify-between">
                <div className="w-12 h-12 bg-emerald-400 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="h-6 w-6 text-slate-800" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-6 leading-tight">
                    96% of TriagePoint's second opinions clarify results
                  </h3>
                  <p className="text-white/80 text-lg">
                    Even great doctors occasionally miss things on scans.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="relative h-80 overflow-hidden border-0 bg-slate-800 text-white">
              <CardContent className="p-8 h-full flex flex-col justify-between">
                <div className="w-12 h-12 bg-emerald-400 rounded-full flex items-center justify-center mb-6">
                  <Clock className="h-6 w-6 text-slate-800" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-6 leading-tight">
                    Fast, affordable, and reassuring
                  </h3>
                  <p className="text-white/80 text-lg">
                    TriagePoint makes it simple to confirm your diagnosis without waiting.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Patient Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="relative max-w-sm">
              <img 
                src={patientTestimonial} 
                alt="Patient testimonial" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-6">
              <div className="text-6xl text-muted-foreground/30 font-serif">"</div>
              <div className="space-y-4">
                <p className="text-xl text-foreground leading-relaxed">
                  When my doctor told me something unusual showed up on my scans, my heart sank. Waiting for answers was unbearable.
                </p>
                <p className="text-xl text-foreground leading-relaxed">
                  TriagePoint quickly connected me with an expert radiologist who reviewed everything with care. Within hours, I had clear answers and peace of mind.
                </p>
                <p className="text-xl text-foreground leading-relaxed font-medium">
                  At my age, that's priceless.
                </p>
              </div>
              <div className="pt-4">
                <p className="text-lg font-semibold text-foreground">Priya S., 58</p>
                <p className="text-muted-foreground">Mumbai, India</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-light text-foreground mb-4">
              You've Got Questions.
            </h2>
            <p className="text-2xl lg:text-3xl font-bold text-foreground mb-6">
              We Have Answers
            </p>
            <p className="text-lg text-muted-foreground">
              What to expect when you request a second opinion from one of our top radiologists.
            </p>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-medium">
                What is a radiology second opinion?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                A radiology second opinion is when a different radiologist reviews your medical images to confirm or provide an alternative interpretation of your original diagnosis.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-medium">
                Why should I get a second opinion?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Second opinions can catch missed diagnoses, provide treatment alternatives, and give you confidence in your medical decisions. Studies show significant diagnostic changes in 20-30% of cases.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-medium">
                Who will be reviewing my case?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Board-certified subspecialty radiologists with 15+ years of experience in their specific areas of expertise will review your images.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-medium">
                How long does it take to get my second opinion?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Most second opinions are delivered within 24-48 hours of receiving your complete medical images and information.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-medium">
                Will my doctor be offended if I get a second opinion?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Most physicians encourage second opinions for complex cases. It's a standard practice that shows you're taking an active role in your healthcare.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
              Clarity That Changed Everything.
            </h2>
            <p className="text-xl text-muted-foreground">
              Thousands of patients trust us for the answers they deserve.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-sm bg-muted/20">
                <CardContent className="p-6">
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground mb-3 italic">"{testimonial.text}"</p>
                  <p className="text-xs text-muted-foreground font-medium">— {testimonial.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/20 rounded-full">
              <Stethoscope className="h-12 w-12" />
            </div>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Your clarity begins here
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands who found peace of mind through expert medical second opinions
          </p>
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg font-semibold"
            onClick={() => navigate('/patient-details')}
          >
            Get Your Second Opinion
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <ChatBot />
      <Footer />
    </div>
  );
};

export default Index;