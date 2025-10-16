import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { 
  Stethoscope,
  Zap,
  CheckCircle,
  ArrowRight
} from "lucide-react";

const About = () => {
  const navigate = useNavigate();
  
  // Animation hooks for different sections
  const heroAnimation = useScrollAnimation(0.1);
  const missionAnimation = useScrollAnimation(0.1);
  const teamAnimation = useScrollAnimation(0.1);


  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section - About Us */}
      <section 
        id="about-hero"
        ref={heroAnimation.ref}
        className={`py-16 md:py-24 bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white relative overflow-hidden transition-all duration-1000 ${
          heroAnimation.isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
        
        {/* Orbital Lines */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              About Us
            </h1>
            <div className="space-y-6 text-lg md:text-xl leading-relaxed">
              <p>
                Last Opinion is at the forefront of accessible radiology last opinions, 
                transforming how patients receive expert medical insights. Our platform 
                seamlessly connects patients with India's largest network of board-certified 
                radiologists, ensuring that geographical barriers never compromise the quality 
                of your healthcare decisions.
              </p>
              <p>
                We specialize in providing comprehensive last opinions for medical imaging 
                studies including CT scans, MRI scans, X-rays, and ultrasound examinations. 
                Our expert radiologists analyze your scans with cutting-edge technology and 
                decades of clinical experience, delivering detailed reports that provide the 
                clarity and confidence you need to make informed decisions about your health.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section 
        ref={missionAnimation.ref}
        className={`py-16 md:py-20 bg-white transition-all duration-1000 delay-200 ${
          missionAnimation.isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  To democratize access to world-class radiology expertise by connecting 
                  patients with India's most experienced radiologists, regardless of their 
                  location or circumstances.
                </p>
                <p className="text-lg text-gray-600 mb-8">
                  We believe that every patient deserves access to the best medical insights 
                  to make informed decisions about their health. Our platform removes the 
                  barriers of distance, time, and accessibility that often prevent patients 
                  from getting the expert opinions they need.
                </p>
                <Button 
                  size="lg" 
                  className="bg-primary text-white hover:bg-primary/90"
                  onClick={() => navigate('/register')}
                >
                  Get Your Last Opinion
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <div className="relative">
                <img 
                  src="/Gemini_Generated_Image_3mmn7a3mmn7a3mmn.png" 
                  alt="Expert radiologist analyzing medical scans" 
                  className="w-full h-[400px] object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Stethoscope className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Technology Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-primary/50 via-white to-primary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <img 
                  src="/Gemini_Generated_Image_vj7j95vj7j95vj7j.png" 
                  alt="Advanced medical imaging technology" 
                  className="w-full h-[400px] object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Advanced Technology
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  We leverage cutting-edge medical imaging technology and AI-powered 
                  analysis tools to enhance the accuracy and speed of our radiology 
                  last opinions.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">DICOM Viewer Integration</h4>
                      <p className="text-gray-600">Advanced imaging viewer for detailed scan analysis</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Secure Cloud Storage</h4>
                      <p className="text-gray-600">HIPAA-compliant data protection and storage</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Expert Network</h4>
                      <p className="text-gray-600">Access to India's largest network of radiologists</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Your Last Opinion?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of patients who have found clarity and confidence through our expert radiology services.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              onClick={() => navigate('/register')}
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
