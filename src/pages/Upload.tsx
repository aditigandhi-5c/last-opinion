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
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const getToken = () => {
    try {
      const raw = localStorage.getItem('token');
      return raw ? raw.replace(/^\"|\"$/g, "").trim() : null;
    } catch {
      return null;
    }
  };

  const ensureCase = async (): Promise<{ caseId: number; patientId: number }> => {
    // Always resolve latest patient from backend for the logged-in user
    const token = getToken();
    if (!token) throw new Error('Missing bearer token. Please login again.');

    // Get latest patient for current user
    const meResp = await fetch('http://127.0.0.1:8000/patients/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
      mode: 'cors',
    });
    if (meResp.status === 401) {
      throw new Error('Invalid or expired session. Please login again.');
    }
    if (meResp.status === 404) {
      // Redirect user to patient details to create a patient once
      navigate('/patient-details');
      throw new Error('No patient found. Please complete patient details first.');
    }
    const me = await meResp.json().catch(() => undefined);
    const patientId: number = Number(me?.id);
    if (!patientId) throw new Error('Unable to resolve patient. Please retry.');

    // Reuse existing case if present
    const existing = localStorage.getItem('currentCaseId');
    if (existing) return { caseId: Number(existing), patientId };

    // Create a new case bound to this patient
    const resp = await fetch('http://127.0.0.1:8000/cases', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ patient_id: patientId }),
    });
    const data = await resp.json().catch(() => undefined);
    if (!resp.ok) {
      const msg = (data && (data.detail || data.message)) || 'Failed to create case';
      throw new Error(msg);
    }
    const caseId = Number(data.id);
    localStorage.setItem('currentCaseId', String(caseId));
    return { caseId, patientId };
  };

  const uploadDicom = async (file: File) => {
    try {
      setUploading(true);
      setUploadError(null);
      setUploadResult(null);
      const { caseId, patientId } = await ensureCase();
      const formData = new FormData();
      formData.append("dicomFile", file);

      const token = getToken();
      const response = await fetch(`http://127.0.0.1:8000/files/dicom?case_id=${caseId}&patient_id=${patientId}`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.detail || data?.message || "Upload failed");
      }
      setUploadResult(data);
      localStorage.setItem("dicomUploadResponse", JSON.stringify(data));
    } catch (err: any) {
      const msg = String(err?.message || err || "Upload failed");
      // If case ownership mismatch occurred, reset and retry once
      if (msg.toLowerCase().includes("not allowed for this case")) {
        try {
          localStorage.removeItem('currentCaseId');
          // retry once with fresh case
          const { caseId, patientId } = await ensureCase();
          const formData = new FormData();
          formData.append("dicomFile", file);
          const token = getToken();
          const resp2 = await fetch(`http://127.0.0.1:8000/files/dicom?case_id=${caseId}&patient_id=${patientId}`, {
            method: "POST",
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            body: formData,
          });
          const data2 = await resp2.json();
          if (!resp2.ok) throw new Error(data2?.detail || data2?.message || "Upload failed");
          setUploadResult(data2);
          localStorage.setItem("dicomUploadResponse", JSON.stringify(data2));
          setUploadError(null);
          return;
        } catch (e2: any) {
          setUploadError(String(e2?.message || e2 || msg));
          return;
        }
      }
      setUploadError(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleDicomUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setDicomFile(file);
      uploadDicom(file);
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
    // Go to Medical Background step before Payment
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
    <div className="min-h-screen bg-background animate-fade-in">
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
                      {!uploading && !uploadError && (
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                      )}
                      {uploading && (
                        <div className="text-sm text-muted-foreground">Uploading...</div>
                      )}
                      {uploadError && (
                        <div className="text-sm text-red-600">{uploadError}</div>
                      )}
                      <div>
                        <p className="font-semibold text-green-700">{dicomFile.name}</p>
                        <p className="text-sm text-muted-foreground">{formatFileSize(dicomFile.size)}</p>
                      </div>
                      {uploadResult && (
                        <div className="text-xs text-muted-foreground break-words">
                          Upload complete
                        </div>
                      )}
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