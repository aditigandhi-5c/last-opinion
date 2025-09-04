import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Search, Users, Eye } from "lucide-react";

const AdminPatients = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const patients = [
    {
      id: "P-1001",
      caseId: "C-1001", 
      name: "Rajesh Kumar",
      email: "rajesh.kumar@email.com",
      phone: "+91 98765 43210",
      paymentStatus: "paid",
      joinDate: "2024-01-15",
      specialty: "Cardiology"
    },
    {
      id: "P-1002",
      caseId: "C-1002",
      name: "Priya Sharma", 
      email: "priya.sharma@email.com",
      phone: "+91 98765 43211",
      paymentStatus: "paid",
      joinDate: "2024-01-14",
      specialty: "Oncology"
    },
    {
      id: "P-1003",
      caseId: "C-1003",
      name: "Amit Patel",
      email: "amit.patel@email.com", 
      phone: "+91 98765 43212",
      paymentStatus: "pending",
      joinDate: "2024-01-13",
      specialty: "Neurology"
    },
    {
      id: "P-1004",
      caseId: "C-1004",
      name: "Sunita Devi",
      email: "sunita.devi@email.com",
      phone: "+91 98765 43213", 
      paymentStatus: "paid",
      joinDate: "2024-01-12",
      specialty: "Gastroenterology"
    },
    {
      id: "P-1005",
      caseId: "C-1005",
      name: "Vikram Singh",
      email: "vikram.singh@email.com",
      phone: "+91 98765 43214",
      paymentStatus: "paid", 
      joinDate: "2024-01-11",
      specialty: "Orthopedics"
    }
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.caseId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPaymentStatusColor = (status: string) => {
    return status === 'paid' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-orange-100 text-orange-800';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Patients</h1>
            <p className="text-muted-foreground">Manage patient records and cases</p>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Users className="h-5 w-5" />
            <span>{patients.length} Total Patients</span>
          </div>
        </div>

        {/* Search */}
        <Card className="medical-shadow">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name, email, or case ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Patients Table */}
        <Card className="medical-shadow">
          <CardHeader>
            <CardTitle>Patient Records</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{patient.caseId}</TableCell>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>
                      <Badge className={getPaymentStatusColor(patient.paymentStatus)}>
                        {patient.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{patient.specialty}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/admin/patients/${patient.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredPatients.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No patients found matching your search.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminPatients;