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

      {/* Academic Excellence Section */}
      <section className="py-16 bg-gradient-to-br from-muted/20 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
              Precision Starts with
            </h2>
            <p className="text-2xl lg:text-3xl font-light text-muted-foreground">
              Academic Excellence
            </p>
            <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
              Our medical experts are educated at the world's most prestigious institutions, 
              bringing unparalleled depth of knowledge to your case.
            </p>
          </div>

          {/* Academic Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {/* Pomona Excellence */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Research Excellence</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Faculty and students collaborate on breakthrough research, with over 50% of students 
                  working closely with professors on cutting-edge medical discoveries.
                </p>
                <div className="text-xs text-primary font-medium">Pomona College Network</div>
              </CardContent>
            </Card>

            {/* Harvey Mudd Innovation */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-lg font-bold mb-2">STEM Innovation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  The Liberal Arts College of Engineering, Science and Mathematics, 
                  fostering 70 years of academic excellence and meaningful STEM contributions.
                </p>
                <div className="text-xs text-secondary font-medium">Harvey Mudd College</div>
              </CardContent>
            </Card>

            {/* CMC Leadership */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-lg font-bold mb-2">Leadership Focus</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Developing leaders who learn, lead, and succeed through innovative education 
                  and hands-on research in the Robert Day Sciences Center.
                </p>
                <div className="text-xs text-accent font-medium">Claremont McKenna College</div>
              </CardContent>
            </Card>

            {/* Scripps Collaboration */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Collaborative Network</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Part of a consortium of five prestigious colleges, offering resources 
                  and opportunities of a large research institution with personalized attention.
                </p>
                <div className="text-xs text-primary font-medium">Scripps College</div>
              </CardContent>
            </Card>

            {/* Pitzer Impact */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Making an Impact</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  #1 Best School for Making an Impact with 18 Fulbright recipients in 2025, 
                  and a U.S. "Top Producer" for 16 consecutive years.
                </p>
                <div className="text-xs text-secondary font-medium">Pitzer College</div>
              </CardContent>
            </Card>

            {/* 5C Consortium */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-lg font-bold mb-2">Proven Excellence</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  The 5C network represents decades of academic excellence, innovative research, 
                  and commitment to developing scholars who make meaningful contributions to society.
                </p>
                <div className="text-xs text-accent font-medium">Five College Consortium</div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Text */}
          <div className="text-center">
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Our medical professionals are educated at these world-renowned institutions, bringing together 
              research excellence, innovative thinking, collaborative expertise, and proven impact 
              — so you can choose with confidence, knowing your case is in the most capable hands.
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