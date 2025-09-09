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
import happyPatientLaptop from "@/assets/happy-patient-laptop.jpg";
import happyPatientConsultation from "@/assets/happy-patient-consultation.jpg";
import happyCoupleLaptop from "@/assets/happy-couple-laptop.jpg";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Index = () => {
  const navigate = useNavigate();
  
  // Animation hooks for different sections
  const heroAnimation = useScrollAnimation(0.1);
  const serviceCardsAnimation = useScrollAnimation(0.1);
  const workflowAnimation = useScrollAnimation(0.1);
  const doctorAnimation = useScrollAnimation(0.1);
  const statsAnimation = useScrollAnimation(0.1);
  const patientStoryAnimation = useScrollAnimation(0.1);
  const faqAnimation = useScrollAnimation(0.1);
  const testimonialsAnimation = useScrollAnimation(0.1);
  const finalCtaAnimation = useScrollAnimation(0.1);

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
      <section className="py-16 bg-gray-50 text-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-8 items-center max-w-7xl mx-auto">
            {/* Left Image */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="relative">
                <img 
                  src="/lovable-uploads/850ffc50-9875-4e44-8bd3-628d367877c6.png" 
                  alt="Happy patient reviewing medical results" 
                  className="w-full h-[350px] object-cover rounded-2xl border-4 border-primary shadow-xl"
                />
                <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-primary rounded-full"></div>
              </div>
            </div>
            
            {/* Center Content */}
            <div className="lg:col-span-3 text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight text-gray-900">
                When Doubt Ends, Healing Begins.
              </h1>
              
              <p className="text-lg md:text-xl lg:text-2xl mb-12 max-w-3xl mx-auto text-gray-700 px-4">
                Get the most accurate interpretation of your scans, guided by subspecialty experts 
                who care about your clarity and peace of mind.
              </p>
              
              <Button 
                size="lg" 
                className="bg-primary text-white hover:bg-primary/90 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold"
                onClick={() => navigate('/patient-details')}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>
            
            {/* Right Image */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="relative">
                <img 
                  src="/lovable-uploads/d5229efa-efbe-491d-b50a-d6bde2ddf868.png" 
                  alt="Happy couple looking at laptop computer together" 
                  className="w-full h-[350px] object-cover rounded-2xl border-4 border-primary shadow-xl"
                />
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-primary rounded-full"></div>
              </div>
            </div>
          </div>
          
          {/* HIPAA Certification Row */}
          <div className="mt-16 pt-8 border-t border-gray-300">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-4xl mx-auto">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold text-gray-900">HIPAA Certified</p>
                  <p className="text-sm text-gray-600">Your data is secure</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold text-gray-900">Board Certified</p>
                  <p className="text-sm text-gray-600">Expert radiologists</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold text-gray-900">10,000+ Patients</p>
                  <p className="text-sm text-gray-600">Trusted nationwide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section with Three Service Boxes */}
      <section 
        ref={serviceCardsAnimation.ref}
        className={`py-16 md:py-20 bg-primary transition-all duration-1000 ${
          serviceCardsAnimation.isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-12 lg:mb-16 gap-8">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                The Last Opinion<br />You'll Ever Need.
              </h2>
            </div>
            <div className="flex-1 lg:ml-8">
              <p className="text-lg md:text-xl text-white/80">
                Our radiologists provide comprehensive, expert second opinions using cutting-edge technology to give you the clarity you deserve.
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <Card className="relative h-80 overflow-hidden group border-0 shadow-elegant bg-gray-50">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-10"
                style={{ backgroundImage: `url(${medicalCareBg})` }}
              />
              <CardContent className="relative z-10 p-8 h-full flex flex-col justify-center">
                <Heart className="h-12 w-12 mb-6 text-primary" />
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Expert Care</h3>
                <p className="text-gray-700">
                  Board-certified radiologists with decades of experience in medical imaging analysis
                </p>
              </CardContent>
            </Card>

            <Card className="relative h-80 overflow-hidden group border-0 shadow-elegant bg-gray-50">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-10"
                style={{ backgroundImage: `url(${medicalReportBg})` }}
              />
              <CardContent className="relative z-10 p-8 h-full flex flex-col justify-center">
                <FileText className="h-12 w-12 mb-6 text-primary" />
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Detailed Reports</h3>
                <p className="text-gray-700">
                  Comprehensive analysis with clear explanations you can understand and trust
                </p>
              </CardContent>
            </Card>

            <Card className="relative h-80 overflow-hidden group border-0 shadow-elegant bg-gray-50">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-10"
                style={{ backgroundImage: `url(${medicalTechBg})` }}
              />
              <CardContent className="relative z-10 p-8 h-full flex flex-col justify-center">
                <Zap className="h-12 w-12 mb-6 text-primary" />
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Fast Results</h3>
                <p className="text-gray-700">
                  Get your expert second opinion within 24 hours, not weeks
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Precision Starts with The Right Doctor Section */}
      <section 
        ref={doctorAnimation.ref}
        className={`py-16 bg-background transition-all duration-1000 delay-200 ${
          doctorAnimation.isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
      >
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

      {/* Workflow Slideshow Section */}
      <section 
        ref={workflowAnimation.ref}
        className={`py-16 bg-white transition-all duration-1000 delay-300 ${
          workflowAnimation.isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
      >
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

      {/* Statistics Section - DocPanel Style */}
      <section 
        ref={statsAnimation.ref}
        className={`py-16 md:py-20 bg-background transition-all duration-1000 delay-400 ${
          statsAnimation.isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-12 lg:mb-16 gap-8">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-foreground leading-tight">
                An Accurate Diagnosis<br />
                <span className="font-bold">Changes Everything</span>
              </h2>
            </div>
            <div className="flex-1 lg:ml-8 flex flex-col justify-center">
              <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8">
                We give you the final, trusted clarity that ends doubt and helps you move forward with confidence in your treatment.
              </p>
              <Button 
                size="lg" 
                className="bg-primary text-white hover:bg-primary/90 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold w-fit"
                onClick={() => navigate('/patient-details')}
              >
                Get Started
              </Button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <Card className="relative h-80 overflow-hidden border-0 bg-slate-800 text-white">
              <CardContent className="p-8 h-full flex flex-col">
                <div className="w-12 h-12 bg-emerald-400 rounded-full flex items-center justify-center mb-6">
                  <Shield className="h-6 w-6 text-slate-800" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 leading-tight">
                    12 million patients are misdiagnosed every year
                  </h3>
                  <p className="text-white/80 text-base">
                    A missed detail could mean the wrong treatment—or no treatment at all.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="relative h-80 overflow-hidden border-0 bg-slate-800 text-white">
              <CardContent className="p-8 h-full flex flex-col">
                <div className="w-12 h-12 bg-emerald-400 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="h-6 w-6 text-slate-800" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 leading-tight">
                    96% of EchoMed's second opinions clarify results
                  </h3>
                  <p className="text-white/80 text-base">
                    Even great doctors occasionally miss things on scans.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="relative h-80 overflow-hidden border-0 bg-slate-800 text-white">
              <CardContent className="p-8 h-full flex flex-col">
                <div className="w-12 h-12 bg-emerald-400 rounded-full flex items-center justify-center mb-6">
                  <Clock className="h-6 w-6 text-slate-800" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 leading-tight">
                    Fast, affordable, and reassuring
                  </h3>
                  <p className="text-white/80 text-base">
                    Echo Meds makes it simple to confirm your diagnosis without waiting.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Patient Story Section */}
      <section 
        ref={patientStoryAnimation.ref}
        className={`py-12 md:py-16 bg-white transition-all duration-1000 delay-500 ${
          patientStoryAnimation.isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 max-w-5xl mx-auto">
            <div className="flex-shrink-0 w-40 md:w-48">
              <img 
                src={patientTestimonial} 
                alt="Patient testimonial" 
                className="w-40 h-40 md:w-48 md:h-48 object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="flex-1 space-y-4">
              <div className="text-4xl text-muted-foreground/30 font-serif">"</div>
              <div className="space-y-3">
                <p className="text-lg text-foreground leading-relaxed">
                  When my doctor told me something unusual showed up on my scans, my heart sank. Waiting for answers was unbearable.
                </p>
                <p className="text-lg text-foreground leading-relaxed">
                  5c network quickly connected me with an expert radiologist who reviewed everything with care. Within hours, I had clear answers and peace of mind.
                </p>
                <p className="text-lg text-foreground leading-relaxed font-medium">
                  At my age, that's priceless.
                </p>
              </div>
              <div className="pt-2">
                <p className="text-base font-semibold text-foreground">Priya S., 58</p>
                <p className="text-sm text-muted-foreground">Mumbai, India</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section 
        ref={faqAnimation.ref}
        className={`py-16 bg-gray-50 transition-all duration-1000 delay-600 ${
          faqAnimation.isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about our second opinion service
            </p>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-gray-200">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-primary">
                What types of medical images can you review?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We review all types of medical imaging including CT scans, MRIs, X-rays, ultrasounds, mammograms, and nuclear medicine studies. Our radiologists are subspecialty-trained in various areas of imaging.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-gray-200">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-primary">
                How long does it take to get my second opinion?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Most second opinions are delivered within 24 hours of receiving your complete medical images and information.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-gray-200">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-primary">
                Are your radiologists board-certified?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes, all of our radiologists are board-certified and fellowship-trained subspecialists with extensive experience in their areas of expertise.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="border-gray-200">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-primary">
                Is my medical information secure?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Absolutely. We are HIPAA compliant and use enterprise-grade security measures to protect your medical information. Your data is encrypted in transit and at rest.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        ref={testimonialsAnimation.ref}
        className={`py-16 bg-white transition-all duration-1000 delay-700 ${
          testimonialsAnimation.isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Patients Say
            </h2>
            <p className="text-lg text-gray-600">
              Real stories from patients who found clarity through our service
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="h-full border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 mb-4 flex-grow">
                    "{testimonial.text}"
                  </blockquote>
                  <footer className="text-sm font-semibold text-gray-900">
                    — {testimonial.author}
                  </footer>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section 
        ref={finalCtaAnimation.ref}
        className={`py-16 md:py-20 bg-primary text-white transition-all duration-1000 delay-800 ${
          finalCtaAnimation.isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Don't Let Doubt Hold You Back
          </h2>
          <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto text-white/90">
            Get the clarity you deserve from world-class radiologists. 
            Your peace of mind is just one click away.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="bg-white text-primary hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            onClick={() => navigate('/patient-details')}
          >
            Get Your Second Opinion
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <Footer />
      <ChatBot />
    </div>
  );
};

export default Index;