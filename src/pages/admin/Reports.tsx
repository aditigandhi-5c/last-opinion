import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Search, FileText, Download, Calendar, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminReports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const reports = [
    {
      id: "RPT-1001",
      caseId: "C-1001",
      patientName: "Rajesh Kumar",
      reportTitle: "Cardiology Second Opinion - Chest Pain Assessment",
      specialty: "Cardiology",
      uploadDate: "2024-01-16",
      reportedBy: "Dr. Suresh Mehta",
      status: "completed",
      fileSize: "2.4 MB"
    },
    {
      id: "RPT-1002",
      caseId: "C-1002", 
      patientName: "Priya Sharma",
      reportTitle: "Oncology Second Opinion - Breast Cancer Staging",
      specialty: "Oncology",
      uploadDate: "2024-01-15",
      reportedBy: "Dr. Anita Verma",
      status: "completed",
      fileSize: "3.1 MB"
    },
    {
      id: "RPT-1003",
      caseId: "C-1003",
      patientName: "Amit Patel", 
      reportTitle: "Neurology Second Opinion - MRI Brain Analysis",
      specialty: "Neurology",
      uploadDate: "2024-01-14",
      reportedBy: "Dr. Rajeev Kumar",
      status: "completed",
      fileSize: "4.7 MB"
    },
    {
      id: "RPT-1004",
      caseId: "C-1004",
      patientName: "Sunita Devi",
      reportTitle: "Gastroenterology Opinion - Liver Function Assessment",
      specialty: "Gastroenterology", 
      uploadDate: "2024-01-13",
      reportedBy: "Dr. Vikash Gupta",
      status: "completed",
      fileSize: "1.8 MB"
    },
    {
      id: "RPT-1005",
      caseId: "C-1005",
      patientName: "Vikram Singh",
      reportTitle: "Orthopedics Opinion - Knee Injury Evaluation", 
      specialty: "Orthopedics",
      uploadDate: "2024-01-12",
      reportedBy: "Dr. Rohit Sharma",
      status: "completed",
      fileSize: "2.9 MB"
    }
  ];

  const filteredReports = reports.filter(report =>
    report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.reportTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadReport = (reportId: string, patientName: string) => {
    toast({
      title: "Download Started",
      description: `Downloading report for ${patientName} (placeholder functionality)`,
    });
  };

  const getSpecialtyColor = (specialty: string) => {
    const colors = {
      'Cardiology': 'bg-red-100 text-red-800',
      'Oncology': 'bg-purple-100 text-purple-800', 
      'Neurology': 'bg-blue-100 text-blue-800',
      'Gastroenterology': 'bg-green-100 text-green-800',
      'Orthopedics': 'bg-orange-100 text-orange-800'
    };
    return colors[specialty as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Reports</h1>
          <p className="text-muted-foreground">Manage and download second opinion reports</p>
        </div>

        {/* Report Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="medical-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                  <p className="text-2xl font-bold">{reports.length}</p>
                  <p className="text-sm text-green-600 font-medium">+8 this week</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <FileText className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="medical-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Reports This Month</p>
                  <p className="text-2xl font-bold">47</p>
                  <p className="text-sm text-green-600 font-medium">+12% vs last month</p>
                </div>
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <Calendar className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="medical-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Turnaround</p>
                  <p className="text-2xl font-bold">36h</p>
                  <p className="text-sm text-green-600 font-medium">-4h improvement</p>
                </div>
                <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="medical-shadow">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by patient name, case ID, report title, or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card className="medical-shadow">
          <CardHeader>
            <CardTitle>Second Opinion Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Report Title</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead>Reported By</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>File Size</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{report.caseId}</TableCell>
                    <TableCell>{report.patientName}</TableCell>
                    <TableCell className="max-w-xs">
                      <p className="truncate">{report.reportTitle}</p>
                    </TableCell>
                    <TableCell>
                      <Badge className={getSpecialtyColor(report.specialty)}>
                        {report.specialty}
                      </Badge>
                    </TableCell>
                    <TableCell>{report.reportedBy}</TableCell>
                    <TableCell>{report.uploadDate}</TableCell>
                    <TableCell className="text-muted-foreground">{report.fileSize}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadReport(report.id, report.patientName)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredReports.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No reports found matching your search.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;