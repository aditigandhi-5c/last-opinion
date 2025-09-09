import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Stethoscope, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <header className="bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50 w-full border-b medical-shadow">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer transition-smooth hover:scale-105"
            onClick={() => navigate('/')}
          >
            <div className="p-2 bg-primary rounded-lg">
              <Stethoscope className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">EchoMed</h1>
              <p className="text-xs text-muted-foreground">Trusted Medical Consultations</p>
            </div>
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center">
            <a href="#how-it-works" className="text-base font-medium text-foreground hover:text-primary transition-smooth">
              How It Works
            </a>
            <a href="#our-experts" className="text-base font-medium text-foreground hover:text-primary transition-smooth">
              Our Experts
            </a>
            <a href="#features" className="text-base font-medium text-foreground hover:text-primary transition-smooth">
              Features
            </a>
            <a href="#reviews" className="text-base font-medium text-foreground hover:text-primary transition-smooth">
              Reviews
            </a>
            <a href="#faqs" className="text-base font-medium text-foreground hover:text-primary transition-smooth">
              FAQ
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {!isAuthPage && (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/login')}
                  className="text-primary hover:bg-primary-light"
                >
                  Login
                </Button>
                <Button 
                  variant="hero" 
                  onClick={() => navigate('/register')}
                >
                  Get Started
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/admin/login')}
                  className="text-xs text-muted-foreground hover:text-primary"
                >
                  Admin
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-smooth">
                How It Works
              </a>
              <a href="#why-trust-us" className="text-muted-foreground hover:text-primary transition-smooth">
                Why Trust Us
              </a>
              <a href="#faqs" className="text-muted-foreground hover:text-primary transition-smooth">
                FAQs
              </a>
              {!isAuthPage && (
                <div className="flex flex-col space-y-2 pt-4">
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/login')}
                    className="justify-start"
                  >
                    Login
                  </Button>
                  <Button 
                    variant="hero" 
                    onClick={() => navigate('/register')}
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;