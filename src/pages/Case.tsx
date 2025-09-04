import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { 
  ArrowLeft, 
  FileText, 
  User, 
  Calendar, 
  MapPin,
  Clock,
  Download,
  Eye,
  CheckCircle
} from "lucide-react";

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

  const uploadedFiles = [
    { name: "Blood_Test_Report.pdf", size: "2.3 MB", type: "Medical Report" },
    { name: "ECG_Report_Jan2024.pdf", size: "1.8 MB", type: "Medical Report" },
    { name: "Chest_Xray.jpg", size: "4.1 MB", type: "Imaging" },
    { name: "CT_Scan_DICOM.dcm", size: "12.5 MB", type: "DICOM Imaging" },
    { name: "Previous_Consultation.pdf", size: "1.2 MB", type: "Prior Report" }
  ];

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
              onClick={() => navigate('/success')}
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

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Patient Information */}
              <Card className="medical-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Patient Information
                  </CardTitle>
                  <CardDescription>
                    Basic demographic and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                      <p className="font-medium">{patientData.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Age</label>
                      <p className="font-medium">{patientData.age} years</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Gender</label>
                      <p className="font-medium">{patientData.gender}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                      <p className="font-medium">{new Date(patientData.dateOfBirth).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">City</label>
                      <p className="font-medium flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {patientData.city}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">PIN Code</label>
                      <p className="font-medium">{patientData.pinCode}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Uploaded Files */}
              <Card className="medical-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Uploaded Files
                  </CardTitle>
                  <CardDescription>
                    Medical reports and documents you've submitted
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {file.type} • {file.size}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Second Opinion Report */}
              <Card className="medical-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Second Opinion Report
                  </CardTitle>
                  <CardDescription>
                    Expert medical opinion and recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h4 className="font-medium mb-2">Report in Progress</h4>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Our medical experts are carefully reviewing your case. 
                      Your detailed second opinion report will appear here within 24-48 hours.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Case Summary */}
              <Card className="medical-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Case Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Case ID</label>
                    <p className="font-mono text-sm">{patientData.caseId}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Submission Date</label>
                    <p className="text-sm flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(patientData.submissionDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Files Uploaded</label>
                    <p className="text-sm">{uploadedFiles.length} files</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Payment Status</label>
                    <p className="text-sm flex items-center gap-1 text-accent">
                      <CheckCircle className="h-4 w-4" />
                      Completed
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
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

              {/* Contact Support */}
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
      </div>

      <Footer />
    </div>
  );
};

export default Case;