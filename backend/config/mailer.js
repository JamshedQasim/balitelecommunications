const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: process.env.MAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

async function sendMail({ to, subject, html }) {
  return transporter.sendMail({
    from: process.env.MAIL_FROM || 'Bali Telecommunications <no-reply@balitelecommunications.com>',
    to,
    subject,
    html
  });
}

async function sendLeadNotification(lead) {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#185FA5;">New Lead Received</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold;">Name</td><td style="padding:8px;border:1px solid #eee;">${lead.name}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold;">Email</td><td style="padding:8px;border:1px solid #eee;">${lead.email}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold;">Phone</td><td style="padding:8px;border:1px solid #eee;">${lead.phone || '-'}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold;">Company</td><td style="padding:8px;border:1px solid #eee;">${lead.company || '-'}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold;">Service Interest</td><td style="padding:8px;border:1px solid #eee;">${lead.service_interest || '-'}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold;">Message</td><td style="padding:8px;border:1px solid #eee;">${lead.message || '-'}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold;">Source Page</td><td style="padding:8px;border:1px solid #eee;">${lead.source_page || '-'}</td></tr>
      </table>
      <p style="color:#666;margin-top:16px;">Received: ${new Date().toLocaleString()}</p>
    </div>
  `;
  return sendMail({
    to: process.env.MAIL_TO || 'sales@balitelecommunications.com',
    subject: `New Lead: ${lead.name} - ${lead.company || 'Individual'}`,
    html
  });
}

async function sendTicketConfirmation(user, ticket) {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#185FA5;">Support Ticket Received</h2>
      <p>Dear ${user.name},</p>
      <p>Your support ticket has been received. Our team will respond within 24 hours.</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold;">Ticket ID</td><td style="padding:8px;border:1px solid #eee;">#${ticket.id}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold;">Subject</td><td style="padding:8px;border:1px solid #eee;">${ticket.subject}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold;">Priority</td><td style="padding:8px;border:1px solid #eee;">${ticket.priority}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold;">Status</td><td style="padding:8px;border:1px solid #eee;">Open</td></tr>
      </table>
      <p style="color:#666;margin-top:16px;">Bali Telecommunications Support Team</p>
    </div>
  `;
  return sendMail({ to: user.email, subject: `Ticket #${ticket.id} Received - ${ticket.subject}`, html });
}

module.exports = { sendMail, sendLeadNotification, sendTicketConfirmation };
