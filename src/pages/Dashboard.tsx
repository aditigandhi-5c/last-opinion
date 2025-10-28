import { useEffect, useState } from "react";
import { fetchMyPatient, getLatestStructuredReportByPatient, getPresignedViewUrl, getLatestPresignedViewUrl, requestConsultation } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { User, FileText, PlusCircle, Eye, Image as ImageIcon, Clock, CheckCircle, MessageCircle, Phone, Calendar, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [patientData, setPatientData] = useState<any>(null);
  const [patientId, setPatientId] = useState<number | null>(null);
  const [questionnaireData, setQuestionnaireData] = useState<any>(null);
  const [fileStatus, setFileStatus] = useState<string | null>(null);
  const [filesHistory, setFilesHistory] = useState<any[]>([]);
  const [pdfByFileId, setPdfByFileId] = useState<Record<number, string>>({});
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [hasStructuredReport, setHasStructuredReport] = useState<boolean>(false);

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
        });
        try {
          const idNum = Number((p as any).id);
          setPatientId(idNum);
          try { localStorage.setItem('lastPatientId', String(idNum)); } catch { /* ignore */ }
        } catch { /* ignore */ }
        // Check if a structured report exists to decide enabling actions
        try {
          const latest = await getLatestStructuredReportByPatient(Number((p as any).id));
          if (latest && latest.id) setHasStructuredReport(true);
        } catch { setHasStructuredReport(false); }
      } catch {
    const patient = localStorage.getItem('patientDetails');
        if (patient) setPatientData(JSON.parse(patient));
      }

      // Reports from backend (all files across cases)
      try {
        const token = getToken();
        if (token) {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://api.lastopinion.in'}/files/mine`, {
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
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://api.lastopinion.in'}/files/${fileId}`, {
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
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://api.lastopinion.in'}/files/mine`, {
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

  const generateDayTabs = () => {
    const now = new Date();
    const fourHoursFromNow = new Date(now.getTime() + 4 * 60 * 60 * 1000);
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(fourHoursFromNow.getTime() + i * 24 * 60 * 60 * 1000);
      days.push({
        date: day,
        label: day.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
        fullLabel: day.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
      });
    }
    
    return days;
  };

  const generateTimeSlotsForDate = (date: Date) => {
    const now = new Date();
    const fourHoursFromNow = new Date(now.getTime() + 4 * 60 * 60 * 1000);
    const slots = [];
    const workingHours = [
      "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"
    ];
    
    workingHours.forEach(time => {
      const slotDateTime = new Date(date);
      const [hours, minutes] = time.split(':');
      slotDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      // Only show slots that are at least 4 hours from now
      if (slotDateTime >= fourHoursFromNow) {
        slots.push({
          value: slotDateTime.toISOString(),
          time: time,
          date: slotDateTime
        });
      }
    });
    
    return slots;
  };

  const isRowReady = (row: any) => {
    const st = (row?.status || '').toLowerCase();
    // Only ready when THIS patient has a structured report, or THIS row's status is completed
    if (hasStructuredReport) return true;
    return st === 'completed' || st === 'done' || st === 'success';
  };

  const statusText = (row: any) => {
    return isRowReady(row) ? 'Your report is ready' : 'Your report is being analysed';
  };

  const statusBadgeClasses = (row: any) => {
    return isRowReady(row)
      ? 'inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200'
      : 'inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200';
  };

  const handleScheduleCall = async () => {
    if (!selectedTimeSlot) {
      toast({
        title: "Please select a time slot",
        description: "Choose your preferred time to connect with our radiologist.",
        variant: "destructive",
      });
      return;
    }

    const selectedDate = new Date(selectedTimeSlot);
    const formattedDate = selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    try {
      // Send consultation request to backend (which notifies Slack)
      await requestConsultation(formattedDate);

    toast({
      title: "Call Scheduled Successfully!",
      description: `Your call with our radiologist is scheduled for ${formattedDate}. We'll contact you at the scheduled time.`,
    });

    setShowScheduleDialog(false);
    setSelectedTimeSlot("");
    } catch (error) {
      console.error("Failed to schedule consultation:", error);
      toast({
        title: "Scheduling Failed",
        description: "Unable to schedule consultation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewReport = async (_fileId: number, studyId?: string | null) => {
    try {
      // 0) Try local structured report from our backend first
      const token = getToken();
      if (token && patientId) {
        try {
          const latest = await getLatestStructuredReportByPatient(patientId);
          const apiBase = import.meta.env.VITE_API_BASE_URL || "https://api.lastopinion.in";
          const url = `${apiBase}${latest.view_generated_url}`; // inline
          const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, credentials: 'include', mode: 'cors' });
          if (res.ok) {
            const blob = await res.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            window.open(blobUrl, '_blank');
            return;
          }
        } catch { /* fall back to vendor below */ }
      }

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

  const handleDownloadReport = async (_fileId: number, studyId?: string | null) => {
    try {
      // 0) Try local structured report from our backend first
      const token = getToken();
      if (token && patientId) {
        try {
          const latest = await getLatestStructuredReportByPatient(patientId);
          const apiBase = import.meta.env.VITE_API_BASE_URL || "https://api.lastopinion.in";
          const url = `${apiBase}${latest.download_generated_url}`; // attachment
          const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, credentials: 'include', mode: 'cors' });
          if (res.ok) {
            const blob = await res.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `medical-report-${latest.id}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
            toast({ title: 'Download started', description: 'Your report is being downloaded.' });
            return;
          }
        } catch { /* fall back */ }
      }

      const apiBase = (import.meta as any)?.env?.VITE_FIVEC_API || 'https://api.5cnetwork.com';
      const radIdEnv = (import.meta as any)?.env?.VITE_FIVEC_RAD_ID;
      const externalAuth = (import.meta as any)?.env?.VITE_FIVEC_AUTH || 'NWNuZXR3b3JrOjVjbmV0d29yaw=='; // default token

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
              const withRad = completed.find((x: any) => x && typeof x === 'object' && (x.rad_fk || x.rad_id));
              if (withRad) radFromCompleted = String(withRad.rad_fk || withRad.rad_id);
            } else if (typeof completed === 'object' && completed?.id) {
              reportIds = [String(completed.id)];
              if (completed.rad_fk || completed.rad_id) radFromCompleted = String(completed.rad_fk || completed.rad_id);
            }
          }
          if (reportIds.length === 0) {
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
            if (url) {
              // Download the PDF file
              const response = await fetch(url);
              const blob = await response.blob();
              const downloadUrl = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = downloadUrl;
              link.download = `medical-report-${studyId || _fileId}.pdf`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              window.URL.revokeObjectURL(downloadUrl);
              toast({ title: 'Download started', description: 'Your report is being downloaded.' });
              return;
            }
          }
        } catch {}
      }
      toast({ title: 'Download not available', description: 'Report not ready for download.' });
    } catch (e: any) {
      toast({ title: 'Download failed', description: 'Unable to download report. Please try again.' });
    }
  };

  const handlePrintReport = async (_fileId: number, _studyId?: string | null) => {
    try {
      const latest = await getLatestStructuredReportByPatient(patientId!);
      const apiBase = import.meta.env.VITE_API_BASE_URL || "https://api.lastopinion.in";
      // Prefer the public inline route in demo to leverage browser viewer directly
      const objectUrl = `${apiBase}/reports/${latest.id}/public?type=generated&disposition=inline`;
      // Open a print-friendly window with iframe
      const win = window.open('', '_blank');
      if (!win) { window.open(objectUrl, '_blank'); return; }
      const html = `<!doctype html><html><head><meta charset="utf-8"><title>Report</title>
        <style>html,body{margin:0;height:100%;}iframe{border:0;width:100%;height:100%;}</style>
        </head><body>
        <iframe id="pdf" src="${objectUrl}"></iframe>
        <script>const f=()=>{try{setTimeout(()=>{window.focus();window.print();},300);}catch(e){}};window.onload=f;</script>
        </body></html>`;
      win.document.open();
      win.document.write(html);
      win.document.close();
    } catch (e: any) {
      toast({ title: 'Print failed', description: 'Unable to print report. Please try again.' });
    }
  };

  const handleViewImages = async (studyIuid?: string | null) => {
    try {
      const token = getToken();
      if (!token) { toast({ title: 'Login required', description: 'Please log in again.' }); return; }
      if (!studyIuid) { toast({ title: 'Viewer unavailable', description: 'Study IUID missing.' }); return; }
      const params = new URLSearchParams({ study_iuid: String(studyIuid) });
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://api.lastopinion.in'}/reports/viewer-link?${params.toString()}`, {
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
            <p className="text-muted-foreground text-lg">
              "Your health deserves a second perspective. Expert insights, just a click away."
            </p>
          </div>

          <div className="flex justify-end mb-4 gap-2">
            <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  <Phone className="mr-2 h-4 w-4" /> Connect Us
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl">
                <DialogHeader className="bg-primary text-white p-6 -m-6 mb-6 rounded-t-lg">
                  <DialogTitle className="flex items-center gap-2 text-white text-xl">
                    <Calendar className="h-6 w-6" />
                    Book Your Radiologist Consultation
                  </DialogTitle>
                </DialogHeader>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Booking Interface */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Service Details */}
                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Radiologist Consultation</h3>
                        <p className="text-sm text-muted-foreground">Get expert medical opinion on your reports</p>
                        <p className="text-sm font-medium text-primary">Free • 15-30 minutes</p>
                      </div>
                    </div>

                    {/* Date Navigation */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Select Date</h3>
                        <div className="text-sm text-muted-foreground">
                          {selectedDate.toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                      
                      {/* Day Tabs */}
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {generateDayTabs().map((day, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedDate(day.date)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                              selectedDate.toDateString() === day.date.toDateString()
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {day.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time Slots */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Available Time Slots</h3>
                      
                      {/* Morning */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Morning</h4>
                        <div className="grid grid-cols-5 gap-2">
                          {generateTimeSlotsForDate(selectedDate)
                            .filter(slot => {
                              const hour = new Date(slot.value).getHours();
                              return hour >= 9 && hour < 12;
                            })
                            .map((slot) => (
                            <button
                              key={slot.value}
                              onClick={() => setSelectedTimeSlot(slot.value)}
                              className={`p-3 text-sm border rounded-lg transition-colors ${
                                selectedTimeSlot === slot.value
                                  ? 'border-primary bg-primary text-white'
                                  : 'border-gray-200 bg-white hover:border-primary/50 hover:bg-primary/5'
                              }`}
                            >
                              {new Date(slot.value).toLocaleTimeString('en-US', { 
                                hour: 'numeric', 
                                minute: '2-digit',
                                hour12: true 
                              })}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Afternoon */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Afternoon</h4>
                        <div className="grid grid-cols-5 gap-2">
                          {generateTimeSlotsForDate(selectedDate)
                            .filter(slot => {
                              const hour = new Date(slot.value).getHours();
                              return hour >= 12 && hour < 17;
                            })
                            .map((slot) => (
                            <button
                              key={slot.value}
                              onClick={() => setSelectedTimeSlot(slot.value)}
                              className={`p-3 text-sm border rounded-lg transition-colors ${
                                selectedTimeSlot === slot.value
                                  ? 'border-primary bg-primary text-white'
                                  : 'border-gray-200 bg-white hover:border-primary/50 hover:bg-primary/5'
                              }`}
                            >
                              {new Date(slot.value).toLocaleTimeString('en-US', { 
                                hour: 'numeric', 
                                minute: '2-digit',
                                hour12: true 
                              })}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Evening */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Evening</h4>
                        <div className="grid grid-cols-5 gap-2">
                          {generateTimeSlotsForDate(selectedDate)
                            .filter(slot => {
                              const hour = new Date(slot.value).getHours();
                              return hour >= 17 && hour <= 19;
                            })
                            .map((slot) => (
                            <button
                              key={slot.value}
                              onClick={() => setSelectedTimeSlot(slot.value)}
                              className={`p-3 text-sm border rounded-lg transition-colors ${
                                selectedTimeSlot === slot.value
                                  ? 'border-primary bg-primary text-white'
                                  : 'border-gray-200 bg-white hover:border-primary/50 hover:bg-primary/5'
                              }`}
                            >
                              {new Date(slot.value).toLocaleTimeString('en-US', { 
                                hour: 'numeric', 
                                minute: '2-digit',
                                hour12: true 
                              })}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Information Card */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-lg">
                      <div className="text-center mb-4">
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Phone className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="font-bold text-lg">Last Opinion</h3>
                        <p className="text-sm text-muted-foreground">Expert Radiologist Consultation</p>
                      </div>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-primary" />
                          <span>+91 95872 74858</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>7 days a week</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>9 AM - 7 PM</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>4-hour advance booking</span>
                        </div>
                      </div>
                    </div>

                    {/* Selected Appointment Summary */}
                    {selectedTimeSlot && (
                      <div className="border rounded-lg p-4 bg-green-50">
                        <h4 className="font-semibold text-green-800 mb-2">Selected Appointment</h4>
                        <div className="text-sm text-green-700">
                          <div className="font-medium">
                            {new Date(selectedTimeSlot).toLocaleDateString('en-US', { 
                              weekday: 'long',
                              month: 'long', 
                              day: 'numeric'
                            })}
                          </div>
                          <div className="text-lg font-bold">
                            {new Date(selectedTimeSlot).toLocaleTimeString('en-US', { 
                              hour: 'numeric', 
                              minute: '2-digit',
                              hour12: true 
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Button
                        onClick={handleScheduleCall}
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={!selectedTimeSlot}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Book Consultation
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowScheduleDialog(false)}
                        className="w-full"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button onClick={startNewCase} className="bg-primary hover:bg-primary/90">
              <PlusCircle className="mr-2 h-4 w-4" /> New Case
            </Button>
          </div>

          <div className="grid lg:grid-cols-1 gap-8">
            {/* Patient Information */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-primary/5">
                <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <User className="h-5 w-5" />
                  Patient Details
                </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/patient-details')}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </div>
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
                          <th className="py-2 pr-4 text-center">Report Status</th>
                          <th className="py-2 pr-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                      {(() => {
                        // Group files by case_id and show only one entry per case
                        const caseMap = new Map();
                        filesHistory
                          .filter(f => !!f && f.status !== '403' && f.case_id)
                          .forEach(f => {
                            if (!caseMap.has(f.case_id)) {
                              caseMap.set(f.case_id, f);
                            }
                          });
                        
                        return Array.from(caseMap.values()).map((f) => (
                          <tr key={f.case_id} className="border-t">
                            <td className="py-2 pr-4">{f.case_id || '-'}</td>
                            <td className="py-2 pr-4 text-center">
                              <span className={statusBadgeClasses(f)}>{statusText(f)}</span>
                            </td>
                            <td className="py-2 pr-4 text-right">
                              <div className="inline-flex gap-2 justify-end">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  disabled={!isRowReady(f)}
                                  className="bg-emerald-700 hover:bg-emerald-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                  onClick={async () => {
                                    try {
                                      const existing = pdfByFileId[f.case_id];
                                      if (existing) { window.open(existing, '_blank'); return; }
                                      // 1) Backend: ask storage to presign the latest PDF for this patient automatically
                                      if (patientId) {
                                        const latest = await getLatestPresignedViewUrl(patientId).catch(() => null);
                                        if (latest && latest.view_url) {
                                          setPdfByFileId(prev => ({ ...prev, [f.case_id]: latest.view_url }));
                                          try { localStorage.setItem('lo_object_key', latest.key); } catch {}
                                          window.open(latest.view_url, '_blank');
                                          return;
                                        }
                                      }

                                      // 2) Prefer an already-created 7-day presigned view URL saved by the uploader
                                      // This matches the alert you showed (copied to clipboard). If present in localStorage, open directly.
                                      try {
                                        let presignedUrl: string | null = null;
                                        // Direct key where uploader can store full 7-day URL
                                        const direct = localStorage.getItem('lo_presigned_view_url');
                                        if (direct && direct.startsWith('http') && direct.includes('second-opinion/')) presignedUrl = direct;
                                        for (let i = 0; i < localStorage.length; i++) {
                                          const k = localStorage.key(i)!;
                                          const v = localStorage.getItem(k) || '';
                                          if (typeof v === 'string' && v.startsWith('http') && v.includes('objectstore.e2enetworks.net') && v.includes('second-opinion/')) {
                                            presignedUrl = v;
                                            break;
                                          }
                                        }
                                        if (presignedUrl) {
                                          setPdfByFileId(prev => ({ ...prev, [f.case_id]: presignedUrl! }));
                                          window.open(presignedUrl, '_blank');
                                          return;
                                        }
                                      } catch { /* ignore and fall through */ }

                                      // 3) Otherwise: View directly from object storage via 7-day signed URL for second-opinion uploads
                                      // Use the exact key saved by the uploader if available (no deletes ever)
                                      let storedKey: string | null = null;
                                      try {
                                        storedKey = localStorage.getItem('lo_object_key')
                                          || localStorage.getItem('second_opinion_object_key')
                                          || localStorage.getItem('last_opinion_object_key');
                                        if (storedKey && !storedKey.includes('second-opinion/')) storedKey = null;
                                        if (!storedKey) {
                                          for (let i = 0; i < localStorage.length; i++) {
                                            const k = localStorage.key(i)!;
                                            const v = localStorage.getItem(k) || '';
                                            if (typeof v === 'string' && v.includes('second-opinion/') && v.endsWith('.pdf')) { storedKey = v; break; }
                                          }
                                        }
                                      } catch { /* ignore */ }

                                      let resp: { view_url: string } | null = null;
                                      if (storedKey) {
                                        resp = await getPresignedViewUrl(storedKey).catch(() => null);
                                      }
                                      if (resp && resp.view_url) {
                                        setPdfByFileId(prev => ({ ...prev, [f.case_id]: resp.view_url }));
                                        window.open(resp.view_url, '_blank');
                                        return;
                                      }
                                       // Final fallback: report not ready yet
                                       toast({ title: 'Report not ready', description: 'Your report is still being processed. Please check back later.' });
                                    } catch {
                                      toast({ title: 'Report not ready', description: 'Please check back soon.' });
                                    }
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-1" /> View
                                </Button>
                          </div>
                            </td>
                          </tr>
                        ));
                      })()}
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