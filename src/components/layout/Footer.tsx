import { Mail, Phone, MapPin } from "lucide-react";
import { Linkedin, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start max-w-7xl mx-auto">
          {/* Left - Logo and Taglines */}
          <div className="flex-1 mb-6 md:mb-0">
            <div className="flex items-center gap-12">
              <img
                src="/1AF54F1D-82E3-43AD-B210-F69182582B7A.png"
                alt="LAST OPINION"
                className="h-28 w-auto object-contain ml-4"
              />
              <div className="ml-8">
                <p className="text-primary-foreground text-lg mb-1">
                  Revealing clarity.
                </p>
                <p className="text-primary-foreground text-lg mb-4">
                  Delivering confidence.
                </p>
                <div className="flex items-center space-x-4">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground/80 transition-smooth">
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground/80 transition-smooth">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground/80 transition-smooth">
                    <Youtube className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Three Columns of Links */}
          <div className="flex gap-20">
            {/* Column 1 */}
            <div>
              <ul className="space-y-3 text-primary-foreground">
                <li><a href="/about" className="hover:text-primary-foreground/80 transition-smooth">About Us</a></li>
                <li><a href="/#why-trust-us" className="hover:text-primary-foreground/80 transition-smooth">Why Trust Us</a></li>
                <li><a href="/#our-experts" className="hover:text-primary-foreground/80 transition-smooth">Our Experts</a></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <ul className="space-y-3 text-primary-foreground">
                <li><a href="/#features" className="hover:text-primary-foreground/80 transition-smooth">How It Works</a></li>
                <li><a href="/#expert-second-opinions" className="hover:text-primary-foreground/80 transition-smooth">Reviews</a></li>
                <li><a href="/#faqs" className="hover:text-primary-foreground/80 transition-smooth">FAQs</a></li>
              </ul>
            </div>

            {/* Column 3 - Contact */}
            <div>
              <h4 className="text-primary-foreground font-semibold mb-3">Contact Us</h4>
              <ul className="space-y-3 text-primary-foreground/80">
                <li className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">support@lastopinion.in</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">+91 95872 74858</span>
                </li>
                <li className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    Last Opinion Towers, #246, 6th Main Rd<br />
                    Above AU Bank, Opposite MedPlus<br />
                    Mico Layout, BTM 2nd Stage<br />
                    Bengaluru, Karnataka 560076, India
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-6 pt-4 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-3">
            <p className="text-primary-foreground/60">© 2024 Last Opinion. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="/privacy" className="text-primary-foreground/60 hover:text-primary-foreground transition-smooth">Privacy Policy</a>
              <a href="/terms" className="text-primary-foreground/60 hover:text-primary-foreground transition-smooth">Terms & Conditions</a>
            </div>
          </div>
          <div className="text-center">
            <p className="text-primary-foreground/50 text-sm">Powered by Last Opinion. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;