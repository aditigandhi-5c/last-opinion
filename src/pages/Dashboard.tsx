import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { User, Upload, FileText, Clock, CheckCircle, Download, Mail } from "lucide-react";

const Dashboard = () => {
  const [patientData, setPatientData] = useState<any>(null);
  const [uploadData, setUploadData] = useState<any>(null);
  const [questionnaireData, setQuestionnaireData] = useState<any>(null);

  useEffect(() => {
    // Load data from localStorage
    const patient = localStorage.getItem('patientDetails');
    const uploads = localStorage.getItem('uploadData');
    const questionnaire = localStorage.getItem('questionnaireData');

    if (patient) setPatientData(JSON.parse(patient));
    if (uploads) setUploadData(JSON.parse(uploads));
    if (questionnaire) setQuestionnaireData(JSON.parse(questionnaire));
  }, []);

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Your Dashboard</h1>
            <p className="text-muted-foreground">
              Track your second opinion request and access your expert report.
            </p>
          </div>

          {/* Status Banner */}
          <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-primary to-secondary text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-full">
                    <Clock className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Your report is under review</h2>
                    <p className="opacity-90">
                      Our expert radiologists are carefully analyzing your scans. 
                      You'll receive your detailed report within 48 hours.
                    </p>
                  </div>
                </div>
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                  In Progress
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Patient Information */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <User className="h-5 w-5" />
                  Patient Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {patientData ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">
                        {patientData.firstName} {patientData.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Age:</span>
                      <span className="font-medium">{patientData.age} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gender:</span>
                      <span className="font-medium capitalize">{patientData.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{patientData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-medium">{patientData.phone}</span>
                    </div>
                    {patientData.symptoms && (
                      <div className="pt-3 border-t">
                        <span className="text-muted-foreground block mb-2">Symptoms/Condition:</span>
                        <p className="text-sm">{patientData.symptoms}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No patient data available</p>
                )}
              </CardContent>
            </Card>

            {/* Uploaded Files */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-secondary/5">
                <CardTitle className="flex items-center gap-2 text-secondary">
                  <Upload className="h-5 w-5" />
                  Uploaded Files
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {uploadData ? (
                  <div className="space-y-4">
                    {uploadData.dicomFile && (
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium text-green-800">DICOM Scan</p>
                            <p className="text-sm text-green-600">{uploadData.dicomFile.name}</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Uploaded</Badge>
                      </div>
                    )}
                    
                    {uploadData.reportFile && (
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-blue-800">Additional Report</p>
                            <p className="text-sm text-blue-600">{uploadData.reportFile.name}</p>
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">Uploaded</Badge>
                      </div>
                    )}
                    
                    {!uploadData.reportFile && (
                      <div className="p-3 bg-muted/20 rounded-lg border border-muted">
                        <p className="text-sm text-muted-foreground">No additional report uploaded</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No upload data available</p>
                )}
              </CardContent>
            </Card>

            {/* Payment Confirmation */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-accent/5">
                <CardTitle className="flex items-center gap-2 text-accent">
                  <CheckCircle className="h-5 w-5" />
                  Payment Confirmation
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order ID:</span>
                    <span className="font-medium">#RXS{Date.now().toString().slice(-6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount Paid:</span>
                    <span className="font-medium">₹3,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Date:</span>
                    <span className="font-medium">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What's Next */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Clock className="h-5 w-5" />
                  What's Next?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Expert Review in Progress</p>
                      <p className="text-sm text-muted-foreground">
                        Your scans are being analyzed by our radiologist
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-xs font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Report Generation</p>
                      <p className="text-sm text-muted-foreground">
                        Detailed findings will be compiled into your report
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-xs font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Delivery</p>
                      <p className="text-sm text-muted-foreground">
                        You'll receive your report here and via email
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <p className="font-medium text-blue-800">Email Notification</p>
                  </div>
                  <p className="text-sm text-blue-700">
                    We'll send you an email notification as soon as your report is ready.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Information */}
          {questionnaireData?.additionalInfo && (
            <Card className="mt-8 shadow-lg border-0">
              <CardHeader className="bg-muted/20">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Additional Information Provided
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm leading-relaxed">{questionnaireData.additionalInfo}</p>
                {questionnaireData.wantSubspecialist && (
                  <div className="mt-4 p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                    <p className="text-sm font-medium text-secondary">
                      ✓ Subspecialty radiologist review requested
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;