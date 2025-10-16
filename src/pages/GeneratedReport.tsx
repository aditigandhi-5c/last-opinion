import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getLatestStructuredReportByPatient } from "@/lib/api";
import { useNavigate } from "react-router-dom";

const getToken = () => {
  try {
    const raw = localStorage.getItem('token');
    return raw ? raw.replace(/^\"|\"$/g, '').trim() : null;
  } catch {
    return null;
  }
};

const GeneratedReport = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const apiBase = useMemo(() => "http://127.0.0.1:8000", []);

  useEffect(() => {
    (async () => {
      try {
        const token = getToken();
        const p = localStorage.getItem('patientDetails');
        let patientId: number | null = null;
        try {
          const mp = p ? JSON.parse(p) : null;
          if (mp && mp.id) patientId = Number(mp.id);
        } catch { /* ignore */ }
        if (!patientId) {
          // fallback from last Dashboard fetch
          const cached = localStorage.getItem('lastPatientId');
          if (cached) patientId = Number(cached);
        }
        if (!patientId) {
          setLoading(false);
          toast({ title: 'Patient not found', description: 'Open Dashboard first.' });
          return;
        }
        const latest = await getLatestStructuredReportByPatient(patientId);
        const url = `${apiBase}/reports/${latest.id}/public?type=generated&disposition=inline`;
        setReportUrl(url);
      } catch (e: any) {
        toast({ title: 'Report unavailable', description: 'No structured report found.' });
      } finally {
        setLoading(false);
      }
    })();
  }, [apiBase, toast]);

  const handleDownload = async () => {
    try {
      if (!reportUrl) return;
      // convert inline->attachment to force download
      const url = reportUrl.replace('disposition=inline', 'disposition=attachment');
      const res = await fetch(url, { mode: 'cors' });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const href = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = href;
      a.download = 'medical-report.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(href);
    } catch {
      toast({ title: 'Download failed', description: 'Please try again.' });
    }
  };

  const handlePrint = () => {
    try {
      if (!reportUrl) return;
      const win = window.open('', '_blank');
      if (!win) { window.open(reportUrl, '_blank'); return; }
      const html = `<!doctype html><html><head><meta charset="utf-8"><title>Report</title>
        <style>html,body{margin:0;height:100%}iframe{border:0;width:100%;height:100%}</style>
      </head><body>
        <iframe id="pdf" src="${reportUrl}"></iframe>
        <script>const f=()=>{try{const i=document.getElementById('pdf');i&&i.contentWindow&&i.contentWindow.print&&setTimeout(()=>{i.contentWindow.focus();i.contentWindow.print();},300);}catch(e){try{window.print()}catch{}}};window.onload=f;</script>
      </body></html>`;
      win.document.open();
      win.document.write(html);
      win.document.close();
    } catch {
      toast({ title: 'Print failed', description: 'Please try again.' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-2">
        <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
        <div className="flex-1" />
        <Button variant="secondary" onClick={handlePrint}>Print</Button>
        <Button onClick={handleDownload}>Download</Button>
      </div>
      <div className="w-full" style={{height:'calc(100vh - 72px)'}}>
        {loading ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">Loading report…</div>
        ) : reportUrl ? (
          <iframe title="Report" src={reportUrl} style={{border:0,width:'100%',height:'100%'}} />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">No report available</div>
        )}
      </div>
    </div>
  );
};

export default GeneratedReport;
