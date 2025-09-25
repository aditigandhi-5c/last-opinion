"""
Email utility functions for sending various types of emails.

Currently logs email content to console for development.
Easily replaceable with SendGrid, SMTP, or other email services.
"""

import logging
from typing import Optional
from datetime import datetime

logger = logging.getLogger(__name__)


def send_reset_email(to_email: str, reset_link: str) -> bool:
    """
    Send a password reset email to the user.
    
    Args:
        to_email (str): Recipient email address
        reset_link (str): Password reset link with token
        
    Returns:
        bool: True if email was "sent" successfully, False otherwise
    """
    try:
        # For development: Print to console
        print(f"""
    Subject: Password Reset Request
    To: {to_email}

    Please click the following link to reset your password:
    {reset_link}

    This link is valid for 1 hour.
    """)
        
        # SendGrid Email Integration
        sendgrid_api_key = os.getenv('SENDGRID_API_KEY')
        sendgrid_from_email = os.getenv('SENDGRID_FROM_EMAIL', 'noreply@echomed.com')
        
        if sendgrid_api_key:
            try:
                from sendgrid import SendGridAPIClient
                from sendgrid.helpers.mail import Mail
                
                message = Mail(
                    from_email=sendgrid_from_email,
                    to_emails=to_email,
                    subject='Password Reset Request - EchoMed',
                    html_content=f"""
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; text-align: center;">
                            <h1 style="color: white; margin: 0; font-size: 24px;">EchoMed</h1>
                        </div>
                        
                        <div style="padding: 30px; background: #f9fafb;">
                            <h2 style="color: #1f2937; margin-bottom: 20px;">Password Reset Request</h2>
                            
                            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
                                Dear User,
                            </p>
                            
                            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
                                You have requested to reset your password for your EchoMed account.
                            </p>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="{reset_link}" 
                                   style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
                                    Reset My Password
                                </a>
                            </div>
                            
                            <p style="color: #6b7280; font-size: 14px; margin-bottom: 20px;">
                                Or copy and paste this link into your browser:<br>
                                <a href="{reset_link}" style="color: #10b981; word-break: break-all;">{reset_link}</a>
                            </p>
                            
                            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
                                <p style="color: #92400e; margin: 0; font-size: 14px;">
                                    <strong>Security Notice:</strong> This link will expire in 1 hour for security reasons.
                                </p>
                            </div>
                            
                            <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">
                                If you did not request this password reset, please ignore this email.
                            </p>
                        </div>
                        
                        <div style="background: #f3f4f6; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="color: #6b7280; font-size: 12px; margin: 0;">
                                Best regards,<br>
                                <strong>EchoMed Team</strong>
                            </p>
                            <p style="color: #9ca3af; font-size: 11px; margin: 10px 0 0 0;">
                                This is an automated message. Please do not reply to this email.
                            </p>
                        </div>
                    </div>
                    """,
                    plain_text_content=f"""
                    Password Reset Request - EchoMed
                    
                    Dear User,
                    
                    You have requested to reset your password for your EchoMed account.
                    
                    To reset your password, please click the link below:
                    {reset_link}
                    
                    This link will expire in 1 hour for security reasons.
                    
                    If you did not request this password reset, please ignore this email.
                    
                    Best regards,
                    EchoMed Team
                    
                    ---
                    This is an automated message. Please do not reply to this email.
                    """
                )
                
                sg = SendGridAPIClient(api_key=sendgrid_api_key)
                response = sg.send(message)
                
                if response.status_code == 202:
                    logger.info(f"Password reset email sent successfully to {to_email}")
                    return True
                else:
                    logger.error(f"SendGrid error: {response.status_code} - {response.body}")
                    return False
                    
            except ImportError:
                logger.warning("SendGrid not installed. Install with: pip install sendgrid")
                return False
            except Exception as e:
                logger.error(f"SendGrid error: {str(e)}")
                return False
        else:
            logger.warning("SENDGRID_API_KEY not configured, falling back to console output")
        
        return True
        
    except Exception as e:
        logger.error(f"Failed to send password reset email to {to_email}: {str(e)}")
        return False


def send_welcome_email(to_email: str, user_name: Optional[str] = None) -> bool:
    """
    Send a welcome email to new users.
    
    Args:
        to_email (str): Recipient email address
        user_name (str, optional): User's name for personalization
        
    Returns:
        bool: True if email was "sent" successfully, False otherwise
    """
    try:
        subject = "Welcome to EchoMed - Your Second Opinion Journey Begins"
        
        greeting = f"Dear {user_name}," if user_name else "Dear User,"
        
        email_body = f"""
{greeting}

Welcome to EchoMed! We're excited to have you join our community of patients seeking expert second opinions.

Your account has been successfully created. You can now:
- Upload your medical images and reports
- Get expert radiology opinions
- Track your case progress
- Access your reports securely

If you have any questions, please don't hesitate to contact our support team.

Best regards,
EchoMed Team

---
This is an automated message. Please do not reply to this email.
        """.strip()
        
        # For development: Log the email instead of sending
        logger.info("=" * 60)
        logger.info("WELCOME EMAIL")
        logger.info("=" * 60)
        logger.info(f"To: {to_email}")
        logger.info(f"Subject: {subject}")
        logger.info(f"Sent at: {datetime.now().isoformat()}")
        logger.info("-" * 60)
        logger.info(email_body)
        logger.info("=" * 60)
        
        return True
        
    except Exception as e:
        logger.error(f"Failed to send welcome email to {to_email}: {str(e)}")
        return False


def send_case_update_email(to_email: str, case_id: int, status: str) -> bool:
    """
    Send a case status update email to the user.
    
    Args:
        to_email (str): Recipient email address
        case_id (int): Case ID
        status (str): New case status
        
    Returns:
        bool: True if email was "sent" successfully, False otherwise
    """
    try:
        subject = f"Case Update - EchoMed Case #{case_id}"
        
        status_messages = {
            "pending": "Your case is being reviewed by our expert radiologists.",
            "in_progress": "Our radiologists are actively working on your case.",
            "completed": "Your radiology report is ready for review.",
            "cancelled": "Your case has been cancelled."
        }
        
        status_message = status_messages.get(status, f"Your case status has been updated to: {status}")
        
        email_body = f"""
Dear User,

We have an update on your EchoMed case #{case_id}.

Status: {status.title()}
{status_message}

You can view your case details and reports by logging into your EchoMed dashboard.

If you have any questions, please contact our support team.

Best regards,
EchoMed Team

---
This is an automated message. Please do not reply to this email.
        """.strip()
        
        # For development: Log the email instead of sending
        logger.info("=" * 60)
        logger.info("CASE UPDATE EMAIL")
        logger.info("=" * 60)
        logger.info(f"To: {to_email}")
        logger.info(f"Subject: {subject}")
        logger.info(f"Sent at: {datetime.now().isoformat()}")
        logger.info("-" * 60)
        logger.info(email_body)
        logger.info("=" * 60)
        
        return True
        
    except Exception as e:
        logger.error(f"Failed to send case update email to {to_email}: {str(e)}")
        return False
