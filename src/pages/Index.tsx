import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
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
  Zap,
  ChevronLeft,
  ChevronRight
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
import doctor1 from "@/assets/doctor-1.jpg";
import doctor2 from "@/assets/doctor-2.jpg";
import doctor3 from "@/assets/doctor-3.jpg";
import doctor4 from "@/assets/doctor-4.jpg";
import doctor5 from "@/assets/doctor-5.jpg";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Index = () => {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  // Animation hooks for different sections
  const heroAnimation = useScrollAnimation(0.1);
  const serviceCardsAnimation = useScrollAnimation(0.1);
  const workflowAnimation = useScrollAnimation(0.1);
  const doctorAnimation = useScrollAnimation(0.1);
  const statsAnimation = useScrollAnimation(0.1);
  const patientStoryAnimation = useScrollAnimation(0.1);
  const faqAnimation = useScrollAnimation(0.1);
  
  const finalCtaAnimation = useScrollAnimation(0.1);

  const trustPoints = [
    {
      icon: <Award className="h-6 w-6" />,
      title: "Reviewed by world-class radiologists",
      description: "Board-certified subspecialty experts with 15+ years experience"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Accurate results within 1-2 business days",
      description: "Fast turnaround without compromising quality"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Trusted by thousands of patients",
      description: "Over 10,000 patients have found clarity through our platform"
    }
  ];

  const doctorTestimonials = [
    {
      doctor: {
        name: "Dr. Anil Rao",
        specialty: "Neuroradiology",
        image: doctor1
      },
      patient: {
        text: "When my doctor told me something unusual showed up on my brain scan, I was terrified. Dr. Rao's detailed second opinion not only clarified what we were seeing but also provided the reassurance I desperately needed. Her expertise gave me peace of mind during the most frightening time of my life.",
        author: "Aisha Khan, 42",
        location: "Mumbai, MH"
      }
    },
    {
      doctor: {
        name: "Dr. Aarti Mehta",
        specialty: "Musculoskeletal Radiology",
        image: doctor2
      },
      patient: {
        text: "After my MRI showed what looked like a serious spinal issue, I was told I might need major surgery. Dr. Mehta's second opinion revealed it was actually a much more manageable condition. His careful analysis saved me from unnecessary surgery and changed my entire treatment path.",
        author: "Rakesh Verma, 58",
        location: "New Delhi, DL"
      }
    },
    {
      doctor: {
        name: "Dr. Pranav Sharma",
        specialty: "Breast Imaging",
        image: doctor3
      },
      patient: {
        text: "The mammogram results were unclear and my local radiologist recommended immediate biopsy. Dr. Sharma's expert review showed it was likely benign and suggested follow-up imaging instead. Six months later, she was proven right. Her expertise saved me from an invasive procedure.",
        author: "Lakshmi Menon, 51",
        location: "Chennai, TN"
      }
    },
    {
      doctor: {
        name: "Dr. Riya Iyer",
        specialty: "Abdominal Radiology",
        image: doctor4
      },
      patient: {
        text: "My CT scan showed something concerning in my abdomen, and my doctor was worried about cancer. Dr. Iyer's thorough second opinion identified it as a benign condition that just needed monitoring. His detailed explanation helped me understand exactly what was happening in my body.",
        author: "Rajiv Patel, 65",
        location: "Ahmedabad, GJ"
      }
    },
    {
      doctor: {
        name: "Dr. Neeraj Kapoor",
        specialty: "Cardiac Imaging",
        image: doctor5
      },
      patient: {
        text: "After my cardiac CT, I was told I might need immediate intervention. Dr. Kapoor's second opinion provided a more nuanced view that allowed for conservative management first. Her expertise helped me avoid rushing into a procedure I didn't actually need.",
        author: "Anita Desai, 47",
        location: "Bengaluru, KA"
      }
    }
  ];

  // Auto-advance testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % doctorTestimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [doctorTestimonials.length]);

  // Smooth scroll on hash navigation when landing on home
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => {
      const next = (prev + 1) % doctorTestimonials.length;
      return next;
    });
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => {
      const previous = (prev - 1 + doctorTestimonials.length) % doctorTestimonials.length;
      return previous;
    });
  };

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Header />
      
      {/* Hero Section */}
      <section id="hero" className="py-12 md:py-16 bg-gradient-to-r from-primary/30 via-white to-primary/30 text-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 items-center max-w-7xl mx-auto">
            {/* Left Image */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="relative transform translate-x-3">
                <img 
                  src="/lovable-uploads/50475260-1d3f-4f1f-b4c9-55dc52242839.png" 
                  alt="Happy patient reviewing medical results" 
                  className="w-full h-[350px] object-cover rounded-2xl border-4 border-primary shadow-xl"
                />
                <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-primary rounded-full"></div>
              </div>
            </div>
            
            {/* Center Content */}
            <div className="lg:col-span-3 text-center px-2 flex flex-col items-center">
              <div className="text-lg sm:text-xl md:text-2xl text-gray-600 font-light mb-0 md:mb-0 translate-y-2 md:translate-y-3">
                Get a Radiology Opinion
              </div>
              {/* Replace text lockup with provided image */}
              <div className="relative flex items-center justify-center mt-1 md:mt-2 mb-2 md:mb-3 h-32 sm:h-36 md:h-40 lg:h-44 xl:h-48 overflow-visible">
                <img
                  src="/Black%20and%20White%20Minimalist%20Modern%20Creative%20Design%20Logo%20(2).png"
                  alt="Second Opinion / Last Opinion logo"
                  className="h-full w-auto object-contain mix-blend-multiply opacity-95 scale-[1.8] md:scale-[2.2] lg:scale-[2.4] translate-y-2 md:translate-y-3 pointer-events-none select-none"
                />
              </div>

              <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 md:mb-12 max-w-3xl mx-auto text-gray-700 px-2 sm:px-4">
                When Doubt Ends, Healing Begins.
              </p>

              {/* Benefits row above CTA */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 items-center justify-items-center mb-6">
                <div className="flex items-center gap-1 text-gray-800 text-sm md:text-base font-medium">
                  <CheckCircle className="h-5 w-5 text-green-700" />
                  <span>India’s Largest Network of Expert Radiologists</span>
                </div>
                <div className="flex items-center gap-1 text-gray-800 text-sm md:text-base font-medium">
                  <CheckCircle className="h-5 w-5 text-green-700" />
                  <span>Accurate, Reliable Reports Delivered Nationwide</span>
                </div>
                <div className="flex items-center gap-1 text-gray-800 text-sm md:text-base font-medium">
                  <CheckCircle className="h-5 w-5 text-green-700" />
                  <span>Reports Delivered in 1–2 Business Days</span>
                </div>
              </div>
              
              <Button 
                size="lg" 
                className="bg-primary text-white hover:bg-primary/90 px-5 sm:px-6 md:px-8 py-3 md:py-4 text-sm sm:text-base md:text-lg font-semibold"
                onClick={() => navigate('/register')}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Button>

              {/* Price subtext below CTA */}
              <div className="mt-3 text-xs sm:text-sm text-gray-500">
                Comprehensive Reports from just ₹3000
              </div>
            </div>
            
            {/* Right Image */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="relative transform -translate-x-3">
                <img 
                  src="/lovable-uploads/611f445b-c405-4176-b2b2-32c37525b9e5.png" 
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
                  <p className="font-semibold text-gray-900">25,000+ Patients</p>
                  <p className="text-sm text-gray-600">Trusted nationwide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section with Three Service Boxes */}
      <section 
        id="why-trust-us"
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
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Trusted Care</h3>
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
        id="how-it-works"
        className="py-16 bg-white"
      >
        <div className="max-w-6xl mx-auto px-8">
          {/* Headline */}
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-2" style={{ fontFamily: 'sans-serif', color: '#1B5E20' }}>
              Precision Starts with
            </h2>
            <p className="text-2xl lg:text-3xl font-light text-gray-500" style={{ fontFamily: 'sans-serif' }}>
              The Right Doctor
            </p>
          </div>

          {/* Doctor Cards */}
          <DoctorShowcase />
        </div>
      </section>

      {/* Workflow Slideshow Section (Experts' Second Opinions anchor, original copy) */}
      <section 
        id="experts-second-opinions"
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
        id="our-stories"
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
                onClick={() => navigate('/register')}
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

      {/* Doctor Testimonials Carousel Section */}
      <section 
        id="expert-second-opinions"
        ref={patientStoryAnimation.ref}
        className={`py-16 md:py-20 bg-white transition-all duration-1000 delay-500 ${
          patientStoryAnimation.isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Expert Second Opinions
            </h2>
            <p className="text-lg text-muted-foreground">
              Real patient stories and the doctors who provided clarity
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-muted/30 min-h-[400px]">
                <CardContent className="p-8">
                  <div className="flex flex-row items-center gap-8 min-h-[400px]">
                    {/* Doctor Section */}
                    <div className="flex-shrink-0 w-1/3">
                      <div className="text-center">
                        <div className="relative mb-6">
                          <img 
                            key={currentTestimonial}
                            src={doctorTestimonials[currentTestimonial].doctor.image}
                            alt={doctorTestimonials[currentTestimonial].doctor.name} 
                            className="w-48 h-48 object-cover rounded-full mx-auto shadow-lg border-4 border-primary/20 transition-all duration-500 ease-in-out"
                          />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">
                          {doctorTestimonials[currentTestimonial].doctor.name}
                        </h3>
                        <p className="text-primary font-semibold mb-4">
                          {doctorTestimonials[currentTestimonial].doctor.specialty}
                        </p>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                          Reported by this doctor
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Patient Review Section */}
                    <div className="flex-1 w-2/3">
                      <Card className="h-full border-0 shadow-lg">
                        <CardContent className="p-8 flex flex-col justify-center min-h-[300px]">
                          <div className="text-6xl text-primary/20 font-serif mb-4">"</div>
                          <blockquote 
                            key={`testimonial-${currentTestimonial}`}
                            className="text-lg text-foreground leading-relaxed mb-6 transition-all duration-500 ease-in-out"
                          >
                            {doctorTestimonials[currentTestimonial].patient.text}
                          </blockquote>
                          <footer className="border-t pt-4">
                            <p className="font-semibold text-foreground text-lg transition-all duration-500 ease-in-out">
                              {doctorTestimonials[currentTestimonial].patient.author}
                            </p>
                            <p className="text-muted-foreground transition-all duration-500 ease-in-out">
                              {doctorTestimonials[currentTestimonial].patient.location}
                            </p>
                          </footer>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation Arrows */}
              <button
                onClick={prevTestimonial}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-muted/50 transition-colors"
              >
                <ArrowRight className="h-6 w-6 text-muted-foreground rotate-180" />
              </button>
              
              <button
                onClick={nextTestimonial}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-muted/50 transition-colors"
              >
                <ArrowRight className="h-6 w-6 text-muted-foreground" />
              </button>
            </div>

            {/* Step Indicators */}
            <div className="flex justify-center mt-8 space-x-3">
              {doctorTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial 
                      ? 'bg-primary' 
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section 
        id="faqs"
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
            onClick={() => navigate('/register')}
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