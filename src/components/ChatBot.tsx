import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, X, Clock, Shield, FileText } from "lucide-react";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<string | null>(null);

  const faqs = [
    {
      id: "timing",
      question: "When will I get my report?",
      answer: "Within 48 hours.",
      icon: <Clock className="h-4 w-4" />
    },
    {
      id: "reviewer",
      question: "Who is reviewing my case?",
      answer: "A board-certified subspecialist radiologist.",
      icon: <Shield className="h-4 w-4" />
    },
    {
      id: "delivery",
      question: "How will I receive the report?",
      answer: "You will receive a secure PDF in your dashboard and by email.",
      icon: <FileText className="h-4 w-4" />
    }
  ];

  const handleFaqClick = (faqId: string) => {
    setSelectedFaq(selectedFaq === faqId ? null : faqId);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full w-14 h-14 bg-primary hover:bg-primary/90 shadow-lg"
          size="icon"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80">
          <Card className="shadow-2xl border-0">
            <CardHeader className="bg-primary text-white rounded-t-lg">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                How can we help?
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 max-h-80 overflow-y-auto">
              <p className="text-sm text-muted-foreground mb-4">
                Click on any question below for quick answers:
              </p>
              
              {faqs.map((faq) => (
                <div key={faq.id} className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto p-3 hover:bg-muted/50"
                    onClick={() => handleFaqClick(faq.id)}
                  >
                    <div className="flex items-center gap-2">
                      {faq.icon}
                      <span className="text-sm">{faq.question}</span>
                    </div>
                  </Button>
                  
                  {selectedFaq === faq.id && (
                    <div className="bg-primary/10 p-3 rounded-lg border-l-4 border-primary">
                      <p className="text-sm font-medium text-primary">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
              
              <div className="pt-4 border-t">
                <Badge variant="secondary" className="w-full justify-center py-2">
                  Need more help? Contact support
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default ChatBot;