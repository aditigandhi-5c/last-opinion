import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Intake from "./pages/Intake";
import Payment from "./pages/Payment";
import Success from "./pages/Success";
import Case from "./pages/Case";
import NotFound from "./pages/NotFound";
import PatientDetails from "./pages/PatientDetails";
import Upload from "./pages/Upload";
import Questionnaire from "./pages/Questionnaire";
import PaymentPage from "./pages/PaymentPage";
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminPatients from "./pages/admin/Patients";
import AdminPatientDetail from "./pages/admin/PatientDetail";
import AdminPayments from "./pages/admin/Payments";
import AdminReports from "./pages/admin/Reports";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/intake" element={<Intake />} />
          <Route path="/success" element={<Success />} />
          <Route path="/case/:id" element={<Case />} />
          
          {/* New Multi-Step Flow */}
          <Route path="/patient-details" element={<PatientDetails />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          
          {/* Legacy route */}
          <Route path="/old-payment" element={<Payment />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/patients" element={<AdminPatients />} />
          <Route path="/admin/patients/:id" element={<AdminPatientDetail />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
