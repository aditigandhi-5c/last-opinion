import { useEffect, useState } from "react";
import { fetchMyPatient } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { User, FileText, PlusCircle, Eye, Image as ImageIcon, Clock, CheckCircle, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [patientData, setPatientData] = useState<any>(null);
  const [questionnaireData, setQuestionnaireData] = useState<any>(null);
  const [fileStatus, setFileStatus] = useState<string | null>(null);
  const [filesHistory, setFilesHistory] = useState<any[]>([]);
  const [pdfByFileId, setPdfByFileId] = useState<Record<number, string>>({});

  const statusClass = (s?: string) => {
    const t = (s || '').toLowerCase();
    if (t === 'completed') return 'bg-green-100 text-green-800';
    if (t === 'processing') return 'bg-yellow-100 text-yellow-800';
    if (t === 'failed') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getToken = () => {
    try {
      const raw = localStorage.getItem('token');
      return raw ? raw.replace(/^\"|\"$/g, '').trim() : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    (async () => {
      // Patient details
      try {
        const p = await fetchMyPatient();
        setPatientData({
          firstName: p.first_name,
          lastName: p.last_name,
          age: p.age,
          gender: p.gender,
          email: p.email,
          phone: p.phone,
          symptoms: p.symptoms,
        });
      } catch {
    const patient = localStorage.getItem('patientDetails');
        if (patient) setPatientData(JSON.parse(patient));
      }

      // Reports from backend (all files across cases)
      try {
        const token = getToken();
        if (token) {
          const res = await fetch(`http://127.0.0.1:8000/files/mine`, {
            headers: { Authorization: `Bearer ${token}` },
            credentials: 'include',
            mode: 'cors',
          });
          if (res.ok) {
            const list = await res.json();
            if (Array.isArray(list)) {
              const mapped = list.map((f: any) => ({ id: f.id, case_id: f.case_id, study_iuid: f.study_iuid || null, study_id: f.study_id || null, status: f.status || null }));
              setFilesHistory(mapped);
              try { localStorage.setItem('filesHistory', JSON.stringify(mapped)); } catch { /* ignore */ }
            }
          }
        }
      } catch { /* ignore */ }

      // Questionnaire (for bottom section)
      try {
    const questionnaire = localStorage.getItem('questionnaireData');
    if (questionnaire) setQuestionnaireData(JSON.parse(questionnaire));
      } catch { /* ignore */ }

      // Current upload quick status
      try {
        const dicomResp = localStorage.getItem('dicomUploadResponse');
        if (dicomResp) {
          const current = JSON.parse(dicomResp);
          setFileStatus(current?.status || null);
        }
      } catch { /* ignore */ }
    })();
  }, []);

  // Live poll file status from backend if we have an uploaded file id
  useEffect(() => {
    const dicomResp = localStorage.getItem('dicomUploadResponse');
    if (!dicomResp) return;
    let fileId: number | null = null;
    try { fileId = Number(JSON.parse(dicomResp)?.id) || null; } catch { /* ignore */ }
    if (!fileId) return;
    const token = getToken();
    if (!token) return;

    let cancelled = false;
    const fetchStatus = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/files/${fileId}`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
          mode: 'cors',
        });
        const data = await res.json().catch(() => undefined);
        if (!cancelled && res.ok && data) {
          setFileStatus(data.status || null);
        }
      } catch {
        // ignore transient errors
      }
    };
    fetchStatus();
    const interval = window.setInterval(fetchStatus, 30000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  // Periodically refresh files via /files/mine only (avoid per-id 403s)
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    let cancelled = false;

    const refreshMine = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/files/mine`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
          mode: 'cors',
        });
        if (!res.ok) return;
        const list = await res.json().catch(() => undefined);
        if (!Array.isArray(list)) return;
        const mapped = list.map((f: any) => ({ id: f.id, case_id: f.case_id, study_iuid: f.study_iuid || null, study_id: f.study_id || null, status: f.status || null }));
        if (!cancelled) {
          setFilesHistory(mapped);
          try { localStorage.setItem('filesHistory', JSON.stringify(mapped)); } catch { /* ignore */ }
        }
      } catch { /* ignore */ }
    };

    refreshMine();
    const interval = window.setInterval(refreshMine, 30000);
    return () => { cancelled = true; window.clearInterval(interval); };
  }, []);

  const startNewCase = () => {
    localStorage.removeItem('currentCaseId');
    localStorage.removeItem('dicomUploadResponse');
    localStorage.removeItem('uploadData');
    localStorage.removeItem('questionnaireData');
    navigate('/upload');
  };

  const handleViewReport = async (_fileId: number, studyId?: string | null) => {
    try {
      const apiBase = (import.meta as any)?.env?.VITE_FIVEC_API || 'https://api.5cnetwork.com';
      const radIdEnv = (import.meta as any)?.env?.VITE_FIVEC_RAD_ID;
      const externalAuth = (import.meta as any)?.env?.VITE_FIVEC_AUTH || 'NWNuZXR3b3JrOjVjbmV0d29yaw=='; // default token

      // 1) As requested: call completed -> get report_ids -> call details with send_pdf_url=true
      if (studyId) {
        try {
          const completedResp = await fetch(`${apiBase}/report/client/completed/${encodeURIComponent(String(studyId))}` , {
            headers: { Authorization: externalAuth, 'Content-Type': 'application/json' },
            mode: 'cors',
          });
          const completed = await completedResp.json().catch(() => undefined as any);
          let reportIds: string[] = [];
          let radFromCompleted: string | undefined;
          if (completedResp.ok && completed) {
            if (Array.isArray(completed)) {
              reportIds = completed.map((x: any) => String(x?.id)).filter(Boolean);
              // pick first rad_fk present
              const withRad = completed.find((x: any) => x && typeof x === 'object' && (x.rad_fk || x.rad_id));
              if (withRad) radFromCompleted = String(withRad.rad_fk || withRad.rad_id);
            } else if (typeof completed === 'object' && completed?.id) {
              reportIds = [String(completed.id)];
              if (completed.rad_fk || completed.rad_id) radFromCompleted = String(completed.rad_fk || completed.rad_id);
            }
          }
          if (reportIds.length === 0) {
            // fallback to using study_id directly
            reportIds = [String(studyId)];
          }

          const params = new URLSearchParams({ send_pdf_url: 'true' });
          for (const rid of reportIds) params.append('report_ids[]', rid);
          const finalRadId = radFromCompleted || radIdEnv;
          if (finalRadId) params.set('rad_id', String(finalRadId));
          const detailsResp = await fetch(`${apiBase}/report/details?${params.toString()}`, {
            headers: { Authorization: externalAuth, 'Content-Type': 'application/json' },
            mode: 'cors',
          });
          const details = await detailsResp.json().catch(() => undefined as any);
          if (detailsResp.ok && details) {
            let url: string | null = null;
            if (Array.isArray(details)) {
              for (const it of details) {
                if (it && typeof it === 'object' && it.pdf_url) { url = it.pdf_url; break; }
              }
            } else if (typeof details === 'object') {
              url = details.pdf_url || null;
            }
            if (url) { window.open(url, '_blank'); return; }
          }
        } catch {}
      }
      toast({ title: 'Report not ready', description: 'Please check back soon.' });
    } catch (e: any) {
      toast({ title: 'Report not ready', description: 'Please check back soon.' });
    }
  };

  const handleViewImages = async (studyIuid?: string | null) => {
    try {
      const token = getToken();
      if (!token) { toast({ title: 'Login required', description: 'Please log in again.' }); return; }
      if (!studyIuid) { toast({ title: 'Viewer unavailable', description: 'Study IUID missing.' }); return; }
      const params = new URLSearchParams({ study_iuid: String(studyIuid) });
      const res = await fetch(`http://127.0.0.1:8000/reports/viewer-link?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
        mode: 'cors',
      });
      const data = await res.json().catch(() => ({} as any));
      if (!res.ok) throw new Error(data?.detail || data?.message || 'Link not available');
      if (data?.viewer_url) window.open(data.viewer_url, '_blank');
      else toast({ title: 'Viewer unavailable', description: 'Please check back later.' });
    } catch (e: any) {
      toast({ title: 'Viewer unavailable', description: 'Please check back later.' });
    }
  };

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

          <div className="flex justify-end mb-4 gap-2">
            <Button onClick={startNewCase} className="bg-primary hover:bg-primary/90">
              <PlusCircle className="mr-2 h-4 w-4" /> New Case
            </Button>
          </div>

          <div className="grid lg:grid-cols-1 gap-8">
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
                    
                  </div>
                ) : (
                  <p className="text-muted-foreground">No patient data available</p>
                )}
              </CardContent>
            </Card>

            {/* Reports List */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-secondary/5">
                <CardTitle className="flex items-center gap-2 text-secondary">
                  <FileText className="h-5 w-5" />
                  Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
              {filesHistory && filesHistory.filter(f => !!f && f.status !== '403').length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-muted-foreground">
                          <th className="py-2 pr-4">Case ID</th>
                          <th className="py-2 pr-4">Study IUID</th>
                          <th className="py-2 pr-4">View Report</th>
                        </tr>
                      </thead>
                      <tbody>
                      {filesHistory.filter(f => !!f && f.status !== '403').map((f) => (
                          <tr key={f.id} className="border-t">
                            <td className="py-2 pr-4">{f.case_id || '-'}</td>
                            <td className="py-2 pr-4">{f.study_iuid || '-'}</td>
                            <td className="py-2 pr-4">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={async () => {
                                  try {
                                    const existing = pdfByFileId[f.id];
                                    if (existing) { window.open(existing, '_blank'); return; }
                                    await handleViewReport(Number(f.id), f.study_id);
                                  } catch {
                                    toast({ title: 'Report not ready', description: 'Please check back soon.' });
                                  }
                                }}
                              >
                                <Eye className="h-4 w-4 mr-1" /> View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No reports yet</p>
                )}
              </CardContent>
            </Card>

                  </div>
                  
          

          

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;