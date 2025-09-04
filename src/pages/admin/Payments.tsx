import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Search, CreditCard, TrendingUp, IndianRupee } from "lucide-react";

const AdminPayments = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const payments = [
    {
      id: "PAY-1001",
      caseId: "C-1001",
      patientName: "Rajesh Kumar",
      amount: 3000,
      status: "completed",
      paymentMethod: "UPI",
      transactionId: "TXN123456789",
      date: "2024-01-15",
      time: "14:30"
    },
    {
      id: "PAY-1002", 
      caseId: "C-1002",
      patientName: "Priya Sharma",
      amount: 3000,
      status: "completed",
      paymentMethod: "Credit Card",
      transactionId: "TXN123456790",
      date: "2024-01-14",
      time: "16:45"
    },
    {
      id: "PAY-1003",
      caseId: "C-1003", 
      patientName: "Amit Patel",
      amount: 3000,
      status: "pending",
      paymentMethod: "UPI",
      transactionId: "TXN123456791",
      date: "2024-01-13",
      time: "10:15"
    },
    {
      id: "PAY-1004",
      caseId: "C-1004",
      patientName: "Sunita Devi", 
      amount: 3000,
      status: "completed",
      paymentMethod: "Net Banking",
      transactionId: "TXN123456792",
      date: "2024-01-12",
      time: "12:20"
    },
    {
      id: "PAY-1005",
      caseId: "C-1005",
      patientName: "Vikram Singh",
      amount: 3000,
      status: "failed",
      paymentMethod: "Credit Card",
      transactionId: "TXN123456793",
      date: "2024-01-11", 
      time: "09:30"
    }
  ];

  const filteredPayments = payments.filter(payment =>
    payment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Payments</h1>
          <p className="text-muted-foreground">Monitor payment transactions and revenue</p>
        </div>

        {/* Payment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="medical-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-green-600 font-medium">+15% from last month</p>
                </div>
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <IndianRupee className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="medical-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Payments</p>
                  <p className="text-2xl font-bold">₹{pendingAmount.toLocaleString()}</p>
                  <p className="text-sm text-orange-600 font-medium">{payments.filter(p => p.status === 'pending').length} transactions</p>
                </div>
                <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                  <CreditCard className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="medical-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold">93.8%</p>
                  <p className="text-sm text-green-600 font-medium">+2.1% improvement</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <TrendingUp className="h-6 w-6" />
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
                placeholder="Search by patient name, case ID, or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card className="medical-shadow">
          <CardHeader>
            <CardTitle>Payment Records</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case ID</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date & Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{payment.caseId}</TableCell>
                    <TableCell>{payment.patientName}</TableCell>
                    <TableCell className="font-medium">₹{payment.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{payment.paymentMethod}</TableCell>
                    <TableCell className="font-mono text-sm">{payment.transactionId}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{payment.date}</p>
                        <p className="text-xs text-muted-foreground">{payment.time}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredPayments.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No payment records found matching your search.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminPayments;