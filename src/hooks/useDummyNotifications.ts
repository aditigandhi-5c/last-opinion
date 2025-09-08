import { useToast } from "@/hooks/use-toast";

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

  const sendSlackNotification = (channel: string, message: string) => {
    console.log(`[DUMMY] Slack to ${channel}: ${message}`);
    toast({
      title: "Slack Notification",
      description: `Team notification sent to ${channel}`,
    });
  };

  const sendPatientConfirmations = (patientData: any) => {
    const patientName = `${patientData.firstName} ${patientData.lastName}`;
    
    // Patient WhatsApp confirmation
    setTimeout(() => {
      sendWhatsAppNotification(
        patientName, 
        "Your second opinion request has been received. You'll get your report within 48 hours."
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
      sendSlackNotification(
        "#medical-team",
        `🔔 New second opinion request from ${patientName} - Case ID: #RXS${Date.now().toString().slice(-6)}`
      );
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