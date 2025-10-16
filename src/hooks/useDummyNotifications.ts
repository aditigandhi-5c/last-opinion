import { useToast } from "@/hooks/use-toast";

// Prefer backend-driven notifications. Keep these as UI toasts only; Slack will be triggered server-side.
export const useDummyNotifications = () => {
  const { toast } = useToast();

  const sendWhatsAppNotification = (patientName: string, message: string) => {
    console.log(`[DUMMY] WhatsApp to ${patientName}: ${message}`);
    toast({
      title: "WhatsApp Sent",
      description: `Confirmation message sent to ${patientName} via WhatsApp`,
    });
  };

  const sendEmailNotification = (email: string, subject: string) => {
    console.log(`[DUMMY] Email to ${email}: ${subject}`);
    toast({
      title: "Email Sent",
      description: `Email "${subject}" sent to ${email}`,
    });
  };

  const sendSlackNotification = async (channel: string, message: string) => {
    // Do not hit any test endpoints; real notifications fire from the backend on case creation
    toast({ title: "Slack Notification (preview)", description: `Will send to ${channel}` });
  };

  const sendPatientConfirmations = (patientData: any) => {
    const patientName = `${patientData.firstName} ${patientData.lastName}`;
    
    // Patient WhatsApp confirmation
    setTimeout(() => {
      sendWhatsAppNotification(
        patientName, 
        "Your last opinion request has been received. You'll get your report within 1-2 business days."
      );
    }, 1000);

    // Patient email confirmation
    setTimeout(() => {
      sendEmailNotification(
        patientData.email,
        "Second Opinion Request Confirmed - EchoMed"
      );
    }, 1500);
  };

  const sendTeamNotifications = (patientData: any) => {
    const patientName = `${patientData.firstName} ${patientData.lastName}`;
    
    // Team Slack notification
    setTimeout(() => {
      // UI preview only; backend already sent the real Slack when case was created
      sendSlackNotification("#last-opinion-website", `🔔 New request from ${patientName}`);
    }, 2000);
  };

  return {
    sendWhatsAppNotification,
    sendEmailNotification,
    sendSlackNotification,
    sendPatientConfirmations,
    sendTeamNotifications,
  };
};