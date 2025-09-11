import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Stethoscope, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('isAuthenticated') === 'true';
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  const goTo = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Fallback to updating hash; Index will handle scroll on mount
      navigate(`/#${sectionId}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="container mx-auto px-6 lg:px-8 pt-4">
        <div className="flex h-16 items-center justify-between max-w-7xl mx-auto bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border border-border/50 rounded-full px-6 medical-shadow">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer transition-smooth hover:scale-105"
            onClick={() => navigate('/')}
          >
            <div className="p-2 bg-primary rounded-lg">
              <Stethoscope className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">EchoMed</h1>
              <p className="text-sm text-muted-foreground">Trusted Medical Consultations</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => goTo('how-it-works')} className="text-lg font-medium text-muted-foreground hover:text-primary transition-smooth">
              How It Works
            </button>
            <button onClick={() => goTo('why-trust-us')} className="text-lg font-medium text-muted-foreground hover:text-primary transition-smooth">
              Why Trust Us
            </button>
            <button onClick={() => goTo('expert-second-opinions')} className="text-lg font-medium text-muted-foreground hover:text-primary transition-smooth">
              Our Stories
            </button>
            <button onClick={() => goTo('faqs')} className="text-lg font-medium text-muted-foreground hover:text-primary transition-smooth">
              FAQs
            </button>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {!isAuthPage && !isAuthenticated && (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/login')}
                  className="text-lg text-primary hover:bg-primary-light"
                >
                  Login
                </Button>
                <Button 
                  variant="hero" 
                  onClick={() => navigate('/register')}
                  className="text-lg"
                >
                  Get Started
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/admin/login')}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Admin
                </Button>
              </>
            )}
            {isAuthenticated && (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/dashboard')}
                  className="text-lg hover:bg-primary-light"
                >
                  Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="text-lg"
                >
                  Logout
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <nav className="flex flex-col space-y-4 mt-8">
                  <button onClick={() => goTo('how-it-works')} className="text-foreground text-left hover:text-primary transition-smooth">
                    How It Works
                  </button>
                  <button onClick={() => goTo('why-trust-us')} className="text-foreground text-left hover:text-primary transition-smooth">
                    Why Trust Us
                  </button>
                  <button onClick={() => goTo('expert-second-opinions')} className="text-foreground text-left hover:text-primary transition-smooth">
                    Our Stories
                  </button>
                  <button onClick={() => goTo('faqs')} className="text-foreground text-left hover:text-primary transition-smooth">
                    FAQs
                  </button>
                  {!isAuthPage && !isAuthenticated && (
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
                  {isAuthenticated && (
                    <div className="flex flex-col space-y-2 pt-4">
                      <Button 
                        variant="ghost" 
                        onClick={() => navigate('/dashboard')}
                        className="justify-start"
                      >
                        Dashboard
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleLogout}
                      >
                        Logout
                      </Button>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
      </div>
    </header>
  );
};

export default Header;