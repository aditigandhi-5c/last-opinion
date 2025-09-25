import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowLeft } from "lucide-react";

const Case = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock patient data
  const patientData = {
    name: "John Doe",
    age: 45,
    gender: "Male",
    city: "Mumbai",
    pinCode: "400001",
    dateOfBirth: "1979-03-15",
    caseId: id || "MC-2024-001",
    submissionDate: "2024-01-15",
    status: "Under Review"
  };

  // Files and report details intentionally omitted per simplified view

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "under review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Case Details</h1>
                <p className="text-muted-foreground">
                  View your case information and track progress
                </p>
              </div>
              <Badge className={`${getStatusColor(patientData.status)} px-4 py-2`}>
                {patientData.status}
              </Badge>
            </div>
          </div>

          <div className="space-y-6">
            {/* Progress Timeline */}
            <Card className="medical-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Progress Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-accent rounded-full flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium">Case Submitted</p>
                        <p className="text-xs text-muted-foreground">Jan 15, 2024 - 2:30 PM</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-accent rounded-full flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium">Payment Confirmed</p>
                        <p className="text-xs text-muted-foreground">Jan 15, 2024 - 2:31 PM</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0 animate-pulse"></div>
                      <div>
                        <p className="text-sm font-medium">Under Expert Review</p>
                        <p className="text-xs text-muted-foreground">In Progress</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-muted rounded-full flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Report Ready</p>
                        <p className="text-xs text-muted-foreground">Pending</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

            {/* Need Help */}
            <Card className="bg-primary-light/20 border-primary/20">
                <CardContent className="pt-6">
                  <h4 className="font-medium mb-2">Need Help?</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Contact our support team for any assistance.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Contact Support
                  </Button>
                </CardContent>
            </Card>
          </div>
          </div>
        </div>
      
      <Footer />
    </div>
  );
};

export default Case;