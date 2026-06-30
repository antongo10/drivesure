import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth:
    process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
});

interface PolicyEmailData {
  to: string;
  firstName: string;
  policyNumber: string;
  coverType: string;
  startDate: string;
  endDate: string;
  vehicle: string;
  premium: number;
  frequency: string;
}

export async function sendWelcomeEmail(to: string, firstName: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🚗 DriveSure</h1>
        <p style="color: #bfdbfe; margin: 5px 0 0;">Your Trusted UK Car Insurance</p>
      </div>
      <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
        <h2 style="color: #1e3a5f;">Welcome to DriveSure, ${firstName}!</h2>
        <p>Thank you for creating your account. You can now get an instant quote and manage your car insurance online.</p>
        <a href="${process.env.NEXTAUTH_URL}/dashboard" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 10px;">Go to Dashboard</a>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
        <p style="font-size: 12px; color: #94a3b8;">DriveSure Ltd | Authorised and regulated by the Financial Conduct Authority</p>
      </div>
    </body>
    </html>
  `;

  if (!process.env.SMTP_USER) {
    console.log(`[Email] Welcome email would be sent to ${to}`);
    return;
  }

  await transporter.sendMail({
    from: `"DriveSure" <${process.env.EMAIL_FROM}>`,
    to,
    subject: "Welcome to DriveSure – Your Account is Ready",
    html,
  });
}

export async function sendPolicyConfirmationEmail(data: PolicyEmailData) {
  const coverLabels: Record<string, string> = {
    "third-party": "Third Party",
    "third-party-fire-theft": "Third Party, Fire & Theft",
    comprehensive: "Comprehensive",
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🚗 DriveSure</h1>
        <p style="color: #bfdbfe; margin: 5px 0 0;">Policy Confirmation</p>
      </div>
      <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
        <h2 style="color: #1e3a5f;">Your Policy is Active, ${data.firstName}!</h2>
        <p>Thank you for choosing DriveSure. Your car insurance policy is now active.</p>

        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #1e3a5f; margin-top: 0;">Policy Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #64748b;">Policy Number</td><td style="font-weight: bold;">${data.policyNumber}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Vehicle</td><td>${data.vehicle}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Cover Type</td><td>${coverLabels[data.coverType] || data.coverType}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Start Date</td><td>${data.startDate}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">End Date</td><td>${data.endDate}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Premium</td><td style="font-weight: bold; color: #2563eb;">£${data.premium.toFixed(2)} ${data.frequency}</td></tr>
          </table>
        </div>

        <p>Your insurance certificate is available in your dashboard.</p>
        <a href="${process.env.NEXTAUTH_URL}/dashboard" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 10px;">View Dashboard</a>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
        <p style="font-size: 12px; color: #94a3b8;">DriveSure Ltd | Authorised and regulated by the Financial Conduct Authority | FCA No. 123456</p>
        <p style="font-size: 12px; color: #94a3b8;">If you need to make a claim, call us 24/7: <strong>0800 123 4567</strong></p>
      </div>
    </body>
    </html>
  `;

  if (!process.env.SMTP_USER) {
    console.log(`[Email] Policy confirmation would be sent to ${data.to} for policy ${data.policyNumber}`);
    return;
  }

  await transporter.sendMail({
    from: `"DriveSure" <${process.env.EMAIL_FROM}>`,
    to: data.to,
    subject: `Policy Confirmed – ${data.policyNumber}`,
    html,
  });
}
