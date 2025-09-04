import { useParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  FileText, 
  Upload,
  Download,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminPatientDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();

  // Mock patient data
  const patient = {
    id: id,
    caseId: "C-1001",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com", 
    phone: "+91 98765 43210",
    dob: "1975-03-15",
    gender: "Male",
    city: "Mumbai",
    pinCode: "400001",
    paymentStatus: "paid",
    specialty: "Cardiology",
    joinDate: "2024-01-15",
    medicalHistory: "Patient has a history of hypertension and diabetes. Recent chest pain episodes prompted consultation.",
    uploadedFiles: [
      { name: "ECG_Report_Jan2024.pdf", type: "Prior Report", uploadDate: "2024-01-15" },
      { name: "Blood_Test_Results.pdf", type: "Lab Report", uploadDate: "2024-01-15" },
      { name: "Chest_Xray_DICOM.dcm", type: "DICOM", uploadDate: "2024-01-15" },
      { name: "Previous_Cardiology_Report.pdf", type: "Prior Report", uploadDate: "2024-01-15" }
    ],
    reportStatus: "pending"
  };

  const handleUploadReport = () => {
    toast({
      title: "Report Uploaded Successfully",
      description: "The second opinion report has been uploaded (placeholder functionality)",
    });
  };

  const handleDownloadFile = (fileName: string) => {
    toast({
      title: "Download Started", 
      description: `Downloading ${fileName} (placeholder functionality)`,
    });
  };

  const getFileIcon = (type: string) => {
    return <FileText className="h-4 w-4" />;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Patient Details</h1>
            <p className="text-muted-foreground">Case ID: {patient.caseId}</p>
          </div>
          <Badge className={patient.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
            {patient.paymentStatus}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Demographics */}
          <Card className="medical-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Demographics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{patient.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{patient.dob}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium">{patient.gender}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{patient.city}, {patient.pinCode}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{patient.email}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{patient.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical History */}
          <Card className="medical-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Medical History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{patient.medicalHistory}</p>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">Specialty</p>
                <Badge variant="outline" className="mt-1">{patient.specialty}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Second Opinion Report */}
          <Card className="medical-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Second Opinion Report</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {patient.reportStatus === 'pending' ? (
                <div className="text-center py-8">
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                    <p className="text-orange-800 text-sm">Report pending upload</p>
                  </div>
                  <Button 
                    onClick={handleUploadReport}
                    className="w-full"
                    variant="hero"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Report
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <p className="text-green-800 text-sm">Report uploaded successfully</p>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Uploaded Files */}
        <Card className="medical-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Uploaded Files</span>
              <Badge variant="outline">{patient.uploadedFiles.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {patient.uploadedFiles.map((file, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getFileIcon(file.type)}
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{file.type}</p>
                        <p className="text-xs text-muted-foreground">{file.uploadDate}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDownloadFile(file.name)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminPatientDetail;