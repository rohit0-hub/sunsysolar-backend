const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 5001;

const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL_FROM = process.env.EMAIL_FROM;
const EMAIL_TO = process.env.EMAIL_TO;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Helper function to send email
async function sendEmail(subject, formData, formType) {
  const emailContent = generateEmailContent(formData, formType);

  console.log('\n📧 NEW FORM SUBMISSION:');
  console.log('📋 Subject:', subject);
  console.log('📊 Form Type:', formType);
  console.log('📝 Form Data:', JSON.stringify(formData, null, 2));
  console.log('⏰ Time:', new Date().toLocaleString());
  console.log('📧 Send email to: worksunsysolar@gmail.com');
  console.log('--- END OF SUBMISSION ---\n');

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      subject: subject,
      html: emailContent,
    });

    console.log(`✅ Email sent successfully for ${formType} form`);
    return { success: true, message: 'Form submitted successfully!' };

  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, message: 'Failed to submit form. Please try again.' };
  }
}

// Generate email content
function generateEmailContent(data, formType) {
  let content = '';

  const containerStyle = "background: #f8fafc; padding: 20px; border-radius: 10px; font-family: Arial, sans-serif;";
  const headerStyle = "color: #0b1320; font-family: Arial, sans-serif;";

  switch (formType) {

    case 'residential':
      content = `
        <h2 style="${headerStyle}">🏠 Residential Solar Inquiry</h2>
        <div style="${containerStyle}">
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email || 'Not provided'}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Address:</strong> ${data.address || 'Not provided'}</p>
          <p><strong>Location/Pincode:</strong> ${data.location || data.pincode}</p>
          ${data.monthlyBill ? `<p><strong>Monthly Bill:</strong> ${data.monthlyBill}</p>` : ''}
          <p><strong>Message:</strong> ${data.message || 'No message provided'}</p>
          <p><strong>Form Source:</strong> ${data.formSource || 'Main Page'}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `;
      break;

    case 'commercial':
      content = `
        <h2 style="${headerStyle}">🏢 Commercial Solar Inquiry</h2>
        <div style="${containerStyle}">
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email || 'Not provided'}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Company:</strong> ${data.company || 'Not provided'}</p>
          <p><strong>Address:</strong> ${data.address || 'Not provided'}</p>
          <p><strong>Business Type:</strong> ${data.businessType || 'Not specified'}</p>
          ${data.city ? `<p><strong>City:</strong> ${data.city}</p>` : ''}
          ${data.pincode ? `<p><strong>Pincode:</strong> ${data.pincode}</p>` : ''}
          ${data.monthlyBill ? `<p><strong>Monthly Bill:</strong> ${data.monthlyBill}</p>` : ''}
          <p><strong>Message:</strong> ${data.message || 'No message provided'}</p>
          <p><strong>Form Source:</strong> ${data.formSource || 'Main Page'}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `;
      break;

    case 'housing':
      content = `
        <h2 style="${headerStyle}">🏘️ Housing Society Solar Inquiry</h2>
        <div style="${containerStyle}">
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email || 'Not provided'}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Society Name:</strong> ${data.societyName || 'Not provided'}</p>
          <p><strong>Address:</strong> ${data.address || 'Not provided'}</p>
          <p><strong>Number of Buildings:</strong> ${data.buildings || 'Not specified'}</p>
          ${data.pincode ? `<p><strong>Pincode:</strong> ${data.pincode}</p>` : ''}
          ${data.monthlyBill ? `<p><strong>Monthly Bill:</strong> ${data.monthlyBill}</p>` : ''}
          ${data.designation ? `<p><strong>Designation:</strong> ${data.designation}</p>` : ''}
          ${data.agmApproval ? `<p><strong>AGM Approval:</strong> ${data.agmApproval}</p>` : ''}
          <p><strong>Message:</strong> ${data.message || 'No message provided'}</p>
          <p><strong>Form Source:</strong> ${data.formSource || 'Main Page'}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `;
      break;

    case 'maintenance':
      content = `
        <h2 style="${headerStyle}">🔧 Solar Maintenance Request</h2>
        <div style="${containerStyle}">
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Location:</strong> ${data.location}</p>
          <p><strong>Pincode:</strong> ${data.pincode}</p>
          <p><strong>Kilowatt Setup:</strong> ${data.kilowatt}</p>
          <p><strong>Number of Panels:</strong> ${data.panels}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `;
      break;

    case 'contact':
      content = `
        <h2 style="${headerStyle}">📞 Contact Form Submission</h2>
        <div style="${containerStyle}">
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Subject:</strong> ${data.subject || 'General Inquiry'}</p>
          <p><strong>Message:</strong> ${data.message}</p>
          <p><strong>Newsletter:</strong> ${data.newsletter ? 'Yes' : 'No'}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `;
      break;

    default:
      content = `
        <h2 style="${headerStyle}">📝 General Form Submission</h2>
        <div style="${containerStyle}">
          <pre>${JSON.stringify(data, null, 2)}</pre>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `;
  }

  return content;
}

// Routes

app.post('/api/residential', async (req, res) => {
  const result = await sendEmail('🏠 Residential Solar Inquiry - Sunsy Solar', req.body, 'residential');
  res.json(result);
});

app.post('/api/commercial', async (req, res) => {
  const result = await sendEmail('🏢 Commercial Solar Inquiry - Sunsy Solar', req.body, 'commercial');
  res.json(result);
});

app.post('/api/housing', async (req, res) => {
  const result = await sendEmail('🏘️ Housing Society Solar Inquiry - Sunsy Solar', req.body, 'housing');
  res.json(result);
});

app.post('/api/maintenance', async (req, res) => {
  const result = await sendEmail('🔧 Solar Maintenance Request - Sunsy Solar', req.body, 'maintenance');
  res.json(result);
});

app.post('/api/contact', async (req, res) => {
  const result = await sendEmail('📞 Contact Form Submission - Sunsy Solar', req.body, 'contact');
  res.json(result);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Sunsy Solar Backend Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});
