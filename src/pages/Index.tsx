import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Stethoscope
} from "lucide-react";
import WorkflowSlideshow from "@/components/WorkflowSlideshow";
import ChatBot from "@/components/ChatBot";
import doctor1 from "@/assets/doctor-1.jpg";
import doctor2 from "@/assets/doctor-2.jpg";
import doctor3 from "@/assets/doctor-3.jpg";
import doctor4 from "@/assets/doctor-4.jpg";
import doctor5 from "@/assets/doctor-5.jpg";
import doctor6 from "@/assets/doctor-6.jpg";
import doctor7 from "@/assets/doctor-7.jpg";

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

      {/* Why Choose Us */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
              The Last Opinion You'll Ever Need.
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {trustPoints.map((point, index) => (
              <Card key={index} className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="mx-auto p-3 bg-primary rounded-2xl text-white mb-4 w-fit">
                    {point.icon}
                  </div>
                  <CardTitle className="text-lg font-semibold">{point.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{point.description}</p>
                </CardContent>
              </Card>
            ))}
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

          {/* Doctor Cards Row */}
          <div className="flex justify-center mb-12">
            <div className="relative flex -space-x-4 transform perspective-1000 rotate-y-12">
              {/* Best Match Badge */}
              <div className="absolute -top-8 left-8 z-20">
                <Badge className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Best Match
                </Badge>
              </div>
              
              {/* Available Now Badge */}
              <div className="absolute -top-8 right-8 z-20">
                <Badge className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Available Now
                </Badge>
              </div>

              {/* Doctor Profile Cards */}
              {[
                { src: doctor1, name: "Dr. Smith" },
                { src: doctor2, name: "Dr. Johnson" },
                { src: doctor3, name: "Dr. Williams" },
                { src: doctor4, name: "Dr. Brown" },
                { src: doctor5, name: "Dr. Davis" },
                { src: doctor6, name: "Dr. Miller" },
                { src: doctor7, name: "Dr. Wilson" }
              ].map((doctor, index) => (
                <div
                  key={index}
                  className={`relative transform ${
                    index === 0 ? 'z-10 scale-105' : index === 6 ? 'z-10 scale-105' : 'z-5'
                  } transition-transform hover:scale-110 hover:z-30`}
                  style={{
                    transform: `rotateY(${(index - 3) * 8}deg) translateZ(${Math.abs(index - 3) * -20}px)`
                  }}
                >
                  <Card className="w-32 h-40 border-4 border-white shadow-2xl rounded-2xl overflow-hidden bg-white">
                    <div className="w-full h-full">
                      <img
                        src={doctor.src}
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Institution Logos */}
          <div className="flex justify-center items-center space-x-12 mb-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <span className="text-primary font-bold text-xs">POMONA</span>
              </div>
              <p className="text-xs text-muted-foreground">Pomona College</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <span className="text-secondary font-bold text-xs">HMC</span>
              </div>
              <p className="text-xs text-muted-foreground">Harvey Mudd College</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <span className="text-accent font-bold text-xs">CMC</span>
              </div>
              <p className="text-xs text-muted-foreground">Claremont McKenna</p>
            </div>
          </div>

          {/* Description Text */}
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-lg text-muted-foreground leading-relaxed">
              EchoMed second opinion radiologists are educated at world-class institutions and fellowship trained 
              — so you can choose with confidence, knowing your case is in expert hands.
            </p>
          </div>
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