import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, CreditCard, FileText, TrendingUp, Clock, CheckCircle } from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Patients",
      value: "1,247",
      change: "+12%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Pending Cases", 
      value: "23",
      change: "-5%",
      icon: Clock,
      color: "text-orange-600"
    },
    {
      title: "Completed Reports",
      value: "1,189",
      change: "+8%", 
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Revenue (This Month)",
      value: "₹3,74,100",
      change: "+15%",
      icon: CreditCard,
      color: "text-purple-600"
    }
  ];

  const recentCases = [
    { id: "C-1001", patient: "Rajesh Kumar", type: "Cardiology", status: "pending", priority: "high" },
    { id: "C-1002", patient: "Priya Sharma", type: "Oncology", status: "completed", priority: "medium" },
    { id: "C-1003", patient: "Amit Patel", type: "Neurology", status: "in-review", priority: "high" },
    { id: "C-1004", patient: "Sunita Devi", type: "Gastroenterology", status: "pending", priority: "low" },
    { id: "C-1005", patient: "Vikram Singh", type: "Orthopedics", status: "completed", priority: "medium" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
          <p className="text-muted-foreground">Monitor patient cases and system performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="medical-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-green-600 font-medium">{stat.change} from last month</p>
                  </div>
                  <div className={`p-3 rounded-full bg-muted ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Cases */}
        <Card className="medical-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Recent Cases</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Case ID</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Patient</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Specialty</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCases.map((case_item) => (
                    <tr key={case_item.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-2 font-medium">{case_item.id}</td>
                      <td className="py-3 px-2">{case_item.patient}</td>
                      <td className="py-3 px-2">{case_item.type}</td>
                      <td className="py-3 px-2">
                        <Badge className={getStatusColor(case_item.status)}>
                          {case_item.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-2">
                        <Badge className={getPriorityColor(case_item.priority)}>
                          {case_item.priority}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;