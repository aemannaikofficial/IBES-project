/* global process */
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Staff Name to Email mapping for notifications
const STAFF_EMAILS = {
  "Dr. Sarah Collins": "sarah@gmail.com",
  "Dr. Alice Thompson": "alice@gmail.com",
  "Dr. Emily Watson": "emily@gmail.com",
  "Prof. James Miller": "james@gmail.com",
  "Prof. Robert Reed": "robert@gmail.com",
  "Dr. Kevin Zhang": "kevin@gmail.com",
  "Prof. Linda Wu": "linda@gmail.com",
  "IBES Admin": "aemannaik.official@gmail.com"
};

// Configure Nodemailer with the Admin's Gmail Credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Endpoint: Notify Programme Leader via Email (Step 2 -> Step 3)
app.post('/api/notify-leader', async (req, res) => {
  const { leaderName, applicantName, programmeName } = req.body;

  if (!leaderName || !applicantName) {
    return res.status(400).json({ error: "Leader name and Applicant name are required." });
  }

  const recipientEmail = STAFF_EMAILS[leaderName];
  if (!recipientEmail) {
    return res.status(404).json({ error: `Email not found for leader: ${leaderName}` });
  }

  const mailOptions = {
    from: `"IBES Admin" <${process.env.EMAIL_USER}>`,
    to: recipientEmail,
    subject: `Action Required: New Academic Application - ${applicantName}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 30px; border: 1px solid #e0e0e0; border-radius: 12px; max-width: 600px; color: #333;">
        <h2 style="color: #673ab7; text-align: center;">IBES Academic Portal</h2>
        <p>Dear <strong>${leaderName}</strong>,</p>
        <p>A new application has been assigned to you for academic review.</p>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 5px solid #673ab7;">
          <p><strong>Applicant:</strong> ${applicantName}</p>
          <p><strong>Programme:</strong> ${programmeName || "N/A"}</p>
        </div>
        <p>Please log in to the portal to provide your decision.</p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="http://localhost:5173" style="background-color: #673ab7; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Portal</a>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: `Notification email sent to ${leaderName}.` });
  } catch (error) {
    console.error("Mail Error:", error);
    res.status(500).json({ error: "Failed to send email.", details: error.message });
  }
});

// Endpoint: Notify Admin via Email (Step 3 -> Admin Dashboard)
app.post('/api/notify-admin', async (req, res) => {
  const { leaderName, applicantName, decision } = req.body;

  const mailOptions = {
    from: `"IBES Academic Portal" <${process.env.EMAIL_USER}>`,
    to: "aemannaik.official@gmail.com",
    subject: `Response Received: ${leaderName} has ${decision}ed an application`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 30px; border: 1px solid #e0e0e0; border-radius: 12px; max-width: 600px; color: #333;">
        <h2 style="color: #673ab7;">Academic Decision Alert</h2>
        <p>Dear Admin,</p>
        <p>Programme Leader <strong>${leaderName}</strong> has submitted a decision:</p>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 5px solid ${decision === 'approve' ? '#1e8e3e' : '#d93025'};">
          <p><strong>Applicant:</strong> ${applicantName}</p>
          <p><strong>Decision:</strong> <span style="color: ${decision === 'approve' ? '#1e8e3e' : '#d93025'}; text-transform: uppercase; font-weight: bold;">${decision}</span></p>
        </div>
        <p>Please review this decision on your dashboard.</p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="http://localhost:5173" style="background-color: #673ab7; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Dashboard</a>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Admin notified successfully." });
  } catch (error) {
    console.error("Notify Admin Error:", error);
    res.status(500).json({ error: "Failed to notify admin.", details: error.message });
  }
});

// Endpoint: Notify Applicant upon successful form submission
app.post('/api/notify-applicant', async (req, res) => {
  const { applicantName, applicantEmail } = req.body;

  if (!applicantEmail) {
    return res.status(400).json({ error: "Applicant email is required for confirmation." });
  }

  const mailOptions = {
    from: `"IBES Admissions" <${process.env.EMAIL_USER}>`,
    to: applicantEmail,
    subject: `Application Received - IBES Academic Board`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 30px; border: 1px solid #e0e0e0; border-radius: 12px; max-width: 600px; color: #333; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #673ab7; margin: 0;">Application Confirmed</h2>
          <p style="color: #777; font-size: 14px; margin-top: 5px;">IBES Professional Academic Registry</p>
        </div>
        <p>Dear <strong>${applicantName || "Applicant"}</strong>,</p>
        <p>Thank you for submitting your application form.</p>
        <div style="background-color: #f0fdf4; padding: 15px 20px; border-radius: 8px; margin: 20px 0; border-left: 5px solid #16a34a;">
          <p style="margin: 0;">We have successfully received your credentials and supporting documents. They are currently being queued for Stage 2 Administrative Review.</p>
        </div>
        <p>Someone from the administration team will carefully review your file and contact you shortly with the next steps.</p>
        <p>Best Regards,<br/><br/><strong>IBES Admissions Team</strong><br/><span style="color: #777; font-size: 12px;">This is an automated message. Please do not reply directly to this email.</span></p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Applicant Email Sent to:", applicantEmail, "ID:", info.messageId);
    res.json({ success: true, message: "Applicant confirmation email sent successfully." });
  } catch (error) {
    console.error("Notify Applicant Error:", error);
    res.status(500).json({ error: "Failed to notify applicant.", details: error.message });
  }
});

// Endpoint: Notify Admin immediately upon new application submission
app.post('/api/notify-admin-new', async (req, res) => {
  const { applicantName, applicationType } = req.body;

  const mailOptions = {
    from: `"IBES System" <${process.env.EMAIL_USER}>`,
    to: "aemannaik.official@gmail.com",
    subject: `New Application Submitted: ${applicantName || 'Applicant'}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 30px; border: 1px solid #e0e0e0; border-radius: 12px; max-width: 600px; color: #333;">
        <h2 style="color: #673ab7;">New Form Submission Alert</h2>
        <p>Dear Admin,</p>
        <p>A new ${applicationType || 'academic'} application has just been submitted into the registry.</p>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 5px solid #673ab7;">
          <p style="margin:0 0 8px 0;"><strong>Applicant Name:</strong> ${applicantName || 'Not Required'}</p>
          <p style="margin:0;"><strong>Type:</strong> ${applicationType || 'General Form'}</p>
        </div>
        <p>Please log in to the admin portal to review this application.</p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="http://localhost:5173" style="background-color: #673ab7; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Dashboard</a>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Admin New App Notification Sent:", info.messageId);
    res.json({ success: true, message: "Admin notified successfully of new application." });
  } catch (error) {
    console.error("Admin Notify Error:", error);
    res.status(500).json({ error: "Failed to notify admin.", details: error.message });
  }
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[SERVER] IBES Notification Service running on http://localhost:${PORT}`);
  });
}

export default app;
