import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { 
  CheckCircle, 
  ArrowRight, 
  Clock, 
  FileText, 
  Bell,
  Home
} from "lucide-react";

const Success = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // On payment success, trigger server to resolve study_id/status for the latest uploaded file
    try {
      const raw = localStorage.getItem('dicomUploadResponse');
      const tokenRaw = localStorage.getItem('token');
      const caseIdRaw = localStorage.getItem('currentCaseId');
      if (!raw || !tokenRaw) return;
      const fileId = Number(JSON.parse(raw)?.id);
      const studyIuid = ((): string | null => { try { return String(JSON.parse(raw)?.study_iuid || '') || null; } catch { return null; } })();
      const token = tokenRaw.replace(/^\"|\"$/g, '').trim();
      const caseId = caseIdRaw ? Number(caseIdRaw) : null;
      if (!fileId || !token) return;
      // 1) Ensure a payment row exists for this case (auto success, 3000)
      if (caseId) {
        fetch('http://127.0.0.1:8000/payments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          credentials: 'include',
          mode: 'cors',
          body: JSON.stringify({ case_id: caseId, order_id: `AUTO-${caseId}`, payment_status: 'success', amount: 3000 })
        }).catch(() => {});
      }
      // 2) Ask backend to refresh report status now
      fetch(`http://127.0.0.1:8000/files/${fileId}/refresh-status`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
        mode: 'cors',
      }).catch(() => {});

      // 3) Independently, resolve study_id via external API 2 and then trigger APIs 3 & 4 until a pdf_url is available
      (async () => {
        const apiBase = (import.meta as any)?.env?.VITE_FIVEC_API || 'https://api.5cnetwork.com';
        const radId = (import.meta as any)?.env?.VITE_FIVEC_RAD_ID;
        const externalAuth = (import.meta as any)?.env?.VITE_FIVEC_AUTH as string | undefined; // Authorization header

        // helper: resolve study_id using API 2 (study/uid)
        const resolveStudyId = async (): Promise<string | null> => {
          if (!studyIuid) return null;
          try {
            const r = await fetch(`${apiBase}/study/uid/${encodeURIComponent(studyIuid)}`, {
              headers: externalAuth ? { Authorization: externalAuth } : undefined,
              mode: 'cors',
            });
            const d = await r.json().catch(() => undefined as any);
            if (r.ok && d) {
              const sid = d?.id ?? d?.study_id;
              return sid ? String(sid) : null;
            }
          } catch {}
          return null;
        };

        // helper: from study_id get pdf_url via APIs 3 & 4
        const getPdfUrlOnce = async (studyId: string): Promise<string | null> => {
          try {
            // API 3: completed → report_ids
            const c = await fetch(`${apiBase}/report/client/completed/${encodeURIComponent(studyId)}`, {
              headers: externalAuth ? { Authorization: externalAuth } : undefined,
              mode: 'cors',
            });
            const cd = await c.json().catch(() => undefined as any);
            let reportIds: string[] = [];
            if (c.ok && cd) {
              if (Array.isArray(cd)) reportIds = cd.map((x: any) => String(x?.id)).filter(Boolean);
              else if (cd?.id) reportIds = [String(cd.id)];
            }
            if (reportIds.length === 0) reportIds = [studyId];

            // API 4: details → pdf_url
            const params = new URLSearchParams({ send_pdf_url: 'true' });
            for (const rid of reportIds) params.append('report_ids[]', rid);
            if (radId) params.set('rad_id', String(radId));
            const d = await fetch(`${apiBase}/report/details?${params.toString()}`, {
              headers: externalAuth ? { Authorization: externalAuth } : undefined,
              mode: 'cors',
            });
            const dd = await d.json().catch(() => undefined as any);
            if (d.ok && dd) {
              if (Array.isArray(dd)) {
                for (const it of dd) { if (it?.pdf_url) return String(it.pdf_url); }
              } else if (dd?.pdf_url) { return String(dd.pdf_url); }
            }
          } catch {}
          return null;
        };

        // Poll sequence: resolve study_id then get pdf_url
        let studyId: string | null = null;
        for (let i = 0; i < 6 && !studyId; i++) { // up to ~1 min
          studyId = await resolveStudyId();
          if (studyId) break;
          await new Promise(r => setTimeout(r, 10000));
        }
        if (!studyId) return;

        for (let i = 0; i < 18; i++) { // up to ~3 minutes
          const url = await getPdfUrlOnce(studyId);
          if (url) {
            try { localStorage.setItem(`reportPdfUrl:${studyId}`, url); } catch {}
            break;
          }
          await new Promise(r => setTimeout(r, 10000));
        }
      })();
    } catch {
      // ignore
    }
  }, []);

  const nextSteps = [
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Case Review",
      description: "Our medical experts are reviewing your case and medical history"
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Analysis in Progress", 
      description: "Detailed analysis and last opinion report preparation (1-2 business days)"
    },
    {
      icon: <Bell className="h-5 w-5" />,
      title: "Notification",
      description: "You'll receive WhatsApp and email notifications when your report is ready"
    }
  ];

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Message */}
          <div className="mb-8">
            <div className="mx-auto w-20 h-20 bg-accent rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            
            <h1 className="text-4xl font-bold mb-4">Thank You for Trusting Us!</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Your case has been successfully registered and payment confirmed.
            </p>
            
            <Badge className="bg-accent text-accent-foreground text-sm px-4 py-2">
              Case ID: #MC-2024-001
            </Badge>
          </div>

          {/* What Happens Next */}
          <Card className="medical-shadow mb-8 text-left">
            <CardHeader>
              <CardTitle>What Happens Next?</CardTitle>
              <CardDescription>
                Your journey to getting a trusted last opinion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {nextSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Important Information */}
          <Card className="bg-primary-light/20 border-primary/20 mb-8 text-left">
            <CardContent className="pt-6">
              <h4 className="font-medium mb-3">Important Information</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• You will receive your detailed last opinion report within 1-2 business days</li>
                <li>• Notifications will be sent via WhatsApp and email</li>
                <li>• You can track your case status in your dashboard</li>
                <li>• Our experts are now reviewing your medical information</li>
                <li>• For urgent queries, contact us at +91 98765 43210</li>
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="hero" 
              size="lg"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/')}
            >
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Button>
          </div>

          {/* Contact Support */}
          <div className="mt-12 p-6 bg-muted/30 rounded-lg">
            <h4 className="font-medium mb-2">Need Help?</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Our support team is available 24/7 to assist you with any questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
              <span>📧 support@5csecondopinion.com</span>
              <span className="hidden sm:inline">|</span>
              <span>📞 +91 98765 43210</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Success;