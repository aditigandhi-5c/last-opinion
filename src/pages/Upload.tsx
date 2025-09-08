import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Upload as UploadIcon, FileText, CheckCircle, AlertCircle } from "lucide-react";

const Upload = () => {
  const navigate = useNavigate();
  const [dicomFile, setDicomFile] = useState<File | null>(null);
  const [reportFile, setReportFile] = useState<File | null>(null);

  const handleDicomUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setDicomFile(file);
    }
  };

  const handleReportUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setReportFile(file);
    }
  };

  const handleNext = () => {
    // Store uploaded files info for next step
    const uploadData = {
      dicomFile: dicomFile ? { name: dicomFile.name, size: dicomFile.size } : null,
      reportFile: reportFile ? { name: reportFile.name, size: reportFile.size } : null
    };
    localStorage.setItem('uploadData', JSON.stringify(uploadData));
    navigate('/questionnaire');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Upload Your Medical Files</h1>
            <p className="text-muted-foreground">
              Securely upload your scan files for expert radiologist review.
            </p>
          </div>

          <div className="space-y-6">
            {/* DICOM Upload - Mandatory */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <UploadIcon className="h-5 w-5" />
                  Medical Scan (DICOM) 
                  <Badge variant="secondary" className="ml-2">Optional</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  {dicomFile ? (
                    <div className="space-y-4">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                      <div>
                        <p className="font-semibold text-green-700">{dicomFile.name}</p>
                        <p className="text-sm text-muted-foreground">{formatFileSize(dicomFile.size)}</p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('dicom-upload')?.click()}
                      >
                        Replace File
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <UploadIcon className="h-12 w-12 text-muted-foreground mx-auto" />
                      <div>
                        <p className="font-semibold">Upload your DICOM scan files (optional)</p>
                        <p className="text-sm text-muted-foreground">
                          For demo purposes, you can skip this step
                        </p>
                      </div>
                      <Button
                        onClick={() => document.getElementById('dicom-upload')?.click()}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Select DICOM Files
                      </Button>
                    </div>
                  )}
                  <input
                    id="dicom-upload"
                    type="file"
                    accept=".dcm,.dicom"
                    onChange={handleDicomUpload}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Additional Report Upload - Optional */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-secondary/5">
                <CardTitle className="flex items-center gap-2 text-secondary">
                  <FileText className="h-5 w-5" />
                  Additional Report
                  <Badge variant="secondary" className="ml-2">Optional</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center hover:border-secondary/50 transition-colors">
                  {reportFile ? (
                    <div className="space-y-4">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                      <div>
                        <p className="font-semibold text-green-700">{reportFile.name}</p>
                        <p className="text-sm text-muted-foreground">{formatFileSize(reportFile.size)}</p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('report-upload')?.click()}
                      >
                        Replace File
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                      <div>
                        <p className="font-semibold">Upload previous report (optional)</p>
                        <p className="text-sm text-muted-foreground">
                          PDF, JPEG, PNG files accepted
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('report-upload')?.click()}
                      >
                        Select Report File
                      </Button>
                    </div>
                  )}
                  <input
                    id="report-upload"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleReportUpload}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-blue-800 mb-1">Your files are secure</p>
                    <p className="text-blue-700">
                      All uploads are encrypted and comply with HIPAA standards. 
                      Your medical data is protected and only accessible to authorized radiologists.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 pt-6">
              <Button
                variant="outline"
                onClick={() => navigate('/patient-details')}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Upload;