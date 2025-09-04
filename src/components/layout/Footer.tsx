import { Stethoscope, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-primary-foreground/10 rounded-lg">
                <Stethoscope className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">5C Second Opinion</h3>
                <p className="text-primary-foreground/80 text-sm">Trusted Medical Consultations</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 mb-4 max-w-md">
              Get expert second opinions from certified medical professionals. 
              Your health deserves the best consultation and care.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm">support@5csecondopinion.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+91 95872 74858</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#how-it-works" className="hover:text-primary-foreground transition-smooth">How It Works</a></li>
              <li><a href="#why-trust-us" className="hover:text-primary-foreground transition-smooth">Why Trust Us</a></li>
              <li><a href="#faqs" className="hover:text-primary-foreground transition-smooth">FAQs</a></li>
              <li><a href="/privacy" className="hover:text-primary-foreground transition-smooth">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-primary-foreground/80">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <span className="text-sm">
                  5C Towers, #246, 6th Main Rd<br />
                  Above AU Bank, Opposite MedPlus<br />
                  Mico Layout, BTM 2nd Stage, BTM Layout<br />
                  Bengaluru, Karnataka 560076, India
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
          <p>&copy; 2024 5C Second Opinion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;