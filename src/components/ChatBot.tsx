import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, X, Clock, Shield, FileText } from "lucide-react";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<string | null>(null);
  const [onboarding, setOnboarding] = useState(false);
  const [step, setStep] = useState<
    "REGISTRATION" | "LOGIN" | "PATIENT_DETAILS" | "FILE_UPLOAD" | "MEDICAL_BACKGROUND" | "PAYMENT" | "CONFIRMATION"
  >("REGISTRATION");

  // Shared
  const apiBase = import.meta.env.VITE_API_BASE_URL || "https://api.lastopinion.in";
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const totalSteps = 7;
  const stepIndex = useMemo(() => {
    return [
      "REGISTRATION",
      "LOGIN",
      "PATIENT_DETAILS",
      "FILE_UPLOAD",
      "MEDICAL_BACKGROUND",
      "PAYMENT",
      "CONFIRMATION",
    ].indexOf(step) + 1;
  }, [step]);

  // Auth/session
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    // keep current site behavior intact; just read token if present
    try {
      const raw = localStorage.getItem("token");
      if (raw) setToken(raw.replace(/^\"|\"$/g, ""));
    } catch {}
  }, []);
  const saveToken = (t: string) => {
    setToken(t);
    try { localStorage.setItem("token", t); } catch {}
  };

  // Patient details
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState<"Male" | "Female" | "Other" | "">("");
  const [phone, setPhone] = useState("");
  const [symptoms, setSymptoms] = useState<string | "">("");
  const [patientId, setPatientId] = useState<number | null>(null);
  const [caseId, setCaseId] = useState<number | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  const faqs = [
    {
      id: "timing",
      question: "When will I get my report?",
      answer: "Within 1-2 business days.",
      icon: <Clock className="h-4 w-4" />
    },
    {
      id: "reviewer",
      question: "Who is reviewing my case?",
      answer: "A registered medical practitioner and subspecialist radiologist.",
      icon: <Shield className="h-4 w-4" />
    },
    {
      id: "delivery",
      question: "How will I receive the report?",
      answer: "You will receive a secure PDF in your dashboard and by email.",
      icon: <FileText className="h-4 w-4" />
    }
  ];

  const handleFaqClick = (faqId: string) => {
    setSelectedFaq(selectedFaq === faqId ? null : faqId);
  };

  // ---- API helpers for onboarding ----
  const postJson = async (url: string, body: any, withAuth = false) => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (withAuth && token) headers["Authorization"] = `Bearer ${token}`;
    const r = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data?.detail || data?.message || `Request failed: ${r.status}`);
    return data;
  };

  const doRegistration = async () => {
    setBusy(true); setError(null);
    try {
      if (!email || !password || password.length < 8 || password !== confirmPassword) {
        throw new Error("Enter a valid email, password (min 8), and matching confirm password.");
      }
      // Prefer existing backend endpoints; map /register -> /auth/signup, /login -> /auth/login
      try {
        await postJson(`${apiBase}/auth/signup`, { email, password });
      } catch (e: any) {
        // If email already exists, proceed to login
        if (!String(e?.message || "").toLowerCase().includes("already registered")) {
          // allow signup failure to continue only if it's email exists; else rethrow
          const msg = String(e?.message || e);
          if (!msg.toLowerCase().includes("email")) throw e;
        }
      }
      // Follow main flow: ask the user to login explicitly after registration
      setStep("LOGIN");
    } catch (e: any) {
      setError(String(e?.message || e));
    } finally { setBusy(false); }
  };

  const doLogin = async () => {
    setBusy(true); setError(null);
    try {
      if (!email || !password) throw new Error("Enter email and password");
      const tokenResp = await postJson(`${apiBase}/auth/login`, { email, password });
      const t = tokenResp?.access_token as string;
      if (!t) throw new Error("Failed to retrieve access token.");
      saveToken(t);
      setStep("PATIENT_DETAILS");
    } catch (e: any) { setError(String(e?.message || e)); } finally { setBusy(false); }
  };

  const doPatientDetails = async () => {
    setBusy(true); setError(null);
    try {
      if (!token) throw new Error("Please login first.");
      if (!firstName || !lastName || !age || !gender || !phone) {
        throw new Error("Please fill all required fields.");
      }
      const body = { first_name: firstName, last_name: lastName, age: Number(age), gender, phone, symptoms: symptoms || null };
      const created = await postJson(`${apiBase}/patients`, body, true);
      const pid = Number(created?.id);
      if (!pid) throw new Error("Failed to create patient");
      setPatientId(pid);
      // Create a case for this patient (aligns with website flow)
      const createdCase = await postJson(`${apiBase}/cases`, { patient_id: pid }, true);
      const cid = Number(createdCase?.id);
      if (!cid) throw new Error("Failed to create case");
      setCaseId(cid);
      // persist for consistency with rest of site
      try { localStorage.setItem("currentCaseId", String(cid)); } catch {}
      setStep("FILE_UPLOAD");
    } catch (e: any) {
      setError(String(e?.message || e));
    } finally { setBusy(false); }
  };

  const doFileUpload = async () => {
    setBusy(true); setError(null);
    try {
      if (!token || !patientId || !caseId) throw new Error("Missing case or session.");
      if (!fileToUpload) { setStep("MEDICAL_BACKGROUND"); return; }
      const form = new FormData();
      form.append("dicomFile", fileToUpload);
      const r = await fetch(`${apiBase}/files/dicom?case_id=${caseId}&patient_id=${patientId}` , {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.detail || data?.message || "Upload failed");
      setStep("MEDICAL_BACKGROUND");
    } catch (e: any) { setError(String(e?.message || e)); } finally { setBusy(false); }
  };

  const [medicalBackground, setMedicalBackground] = useState("");
  const doMedicalBackground = async () => {
    setBusy(true); setError(null);
    try {
      if (!token || !caseId) throw new Error("Missing case or session.");
      // Align with backend: update case medical_background (and optionally symptoms)
      const body: any = { medical_background: medicalBackground || null };
      await fetch(`${apiBase}/cases/${caseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      }).then(async r => { if (!r.ok) throw new Error((await r.json()).detail || "Failed to save"); });
      setStep("PAYMENT");
    } catch (e: any) { setError(String(e?.message || e)); } finally { setBusy(false); }
  };

  const doPayment = async () => {
    setBusy(true); setError(null);
    try {
      if (!token || !caseId) throw new Error("Missing case or session.");
      const orderId = `CHATBOT-${Date.now()}`;
      const amount = 3000;
      await postJson(`${apiBase}/payments`, { case_id: caseId, order_id: orderId, payment_status: "success", amount }, true);
      setStep("CONFIRMATION");
      // optional: trigger status refresh if needed
    } catch (e: any) { setError(String(e?.message || e)); } finally { setBusy(false); }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full w-16 h-16 bg-primary hover:bg-primary/90 shadow-2xl hover:shadow-primary/25 transition-all duration-300 hover:scale-110 border-2 border-white"
          size="icon"
        >
          {isOpen ? <X className="h-7 w-7" /> : <MessageCircle className="h-7 w-7" />}
        </Button>
      </div>

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 max-w-[90vw]">
          <Card className="shadow-2xl border-0">
            <CardHeader className="bg-primary text-white rounded-t-lg">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                How can we help?
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
              <p className="text-sm text-muted-foreground mb-4">
                Click on any question below for quick answers:
              </p>
              
              {!onboarding && faqs.map((faq) => (
                <div key={faq.id} className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto p-3 hover:bg-muted/50"
                    onClick={() => handleFaqClick(faq.id)}
                  >
                    <div className="flex items-center gap-2">
                      {faq.icon}
                      <span className="text-sm">{faq.question}</span>
                    </div>
                  </Button>
                  
                  {selectedFaq === faq.id && (
                    <div className="bg-primary/10 p-3 rounded-lg border-l-4 border-primary">
                      <p className="text-sm font-medium text-primary">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}

              {!onboarding && (
                <div className="pt-2">
                  <Button className="w-full" onClick={() => { setOnboarding(true); setStep("REGISTRATION"); }}>
                    Start Onboarding
                  </Button>
                </div>
              )}

              {onboarding && (
                <div className="space-y-3">
                  <div className="text-xs text-muted-foreground">Step {stepIndex} of {totalSteps}</div>

                  {step === "REGISTRATION" && (
                    <div className="space-y-2">
                      <Input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                      <Input placeholder="Password (min 8 chars)" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                      <Input placeholder="Confirm Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                      <div className="flex gap-2">
                        <Button className="flex-1" disabled={busy} onClick={doRegistration}>Continue</Button>
                        <Button variant="outline" className="flex-1" onClick={() => setOnboarding(false)}>Cancel</Button>
                      </div>
                    </div>
                  )}

                  {step === "LOGIN" && (
                    <div className="space-y-2">
                      <Input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                      <Input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                      <div className="flex gap-2">
                        <Button className="flex-1" disabled={busy} onClick={doLogin}>Login</Button>
                        <Button variant="outline" className="flex-1" onClick={() => setOnboarding(false)}>Cancel</Button>
                      </div>
                    </div>
                  )}

                  {step === "PATIENT_DETAILS" && (
                    <div className="space-y-2">
                      <Input placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} />
                      <Input placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} />
                      <Input placeholder="Age" type="number" value={age as any} onChange={e => setAge(e.target.value ? Number(e.target.value) : "")} />
                      <div className="flex gap-2">
                        <Button variant={gender === "Male" ? "default" : "outline"} onClick={() => setGender("Male")}>Male</Button>
                        <Button variant={gender === "Female" ? "default" : "outline"} onClick={() => setGender("Female")}>Female</Button>
                        <Button variant={gender === "Other" ? "default" : "outline"} onClick={() => setGender("Other")}>Other</Button>
                      </div>
                      <Input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
                      <Textarea placeholder="Symptoms / Condition (optional)" value={symptoms as any} onChange={e => setSymptoms(e.target.value)} />
                      <div className="flex gap-2">
                        <Button className="flex-1" disabled={busy} onClick={doPatientDetails}>Continue</Button>
                        <Button variant="outline" className="flex-1" onClick={() => setOnboarding(false)}>Cancel</Button>
                      </div>
                    </div>
                  )}

                  {step === "FILE_UPLOAD" && (
                    <div className="space-y-2">
                      <input type="file" accept=".dcm,.dicom" onChange={(e) => setFileToUpload(e.target.files?.[0] || null)} />
                      <div className="flex gap-2">
                        <Button className="flex-1" disabled={busy} onClick={doFileUpload}>Upload & Continue</Button>
                        <Button variant="outline" className="flex-1" onClick={() => setOnboarding(false)}>Cancel</Button>
                      </div>
                    </div>
                  )}

                  {step === "MEDICAL_BACKGROUND" && (
                    <div className="space-y-2">
                      <Textarea placeholder="Any extra medical history (optional)" value={medicalBackground} onChange={e => setMedicalBackground(e.target.value)} />
                      <div className="flex gap-2">
                        <Button className="flex-1" disabled={busy} onClick={doMedicalBackground}>Continue</Button>
                        <Button variant="outline" className="flex-1" onClick={() => setOnboarding(false)}>Cancel</Button>
                      </div>
                    </div>
                  )}

                  {step === "PAYMENT" && (
                    <div className="space-y-2">
                      <div className="text-sm">Select Payment</div>
                      <div className="flex gap-2">
                        <Button className="flex-1" disabled={busy} onClick={doPayment}>Pay ₹3000</Button>
                        <Button variant="outline" className="flex-1" onClick={() => setOnboarding(false)}>Cancel</Button>
                      </div>
                    </div>
                  )}

                  {step === "CONFIRMATION" && (
                    <div className="space-y-2">
                      <div className="text-sm">You’re all set! Redirecting you to your dashboard…</div>
                      <Button onClick={() => { window.location.href = "/dashboard"; }}>Go to Dashboard</Button>
                    </div>
                  )}

                  {error && (
                    <div className="text-xs text-red-600">{error}</div>
                  )}
                </div>
              )}
              
              <div className="pt-4 border-t">
                <Badge variant="secondary" className="w-full justify-center py-2">
                  Need more help? Contact support
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default ChatBot;