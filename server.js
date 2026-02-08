const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Helper function to send email
async function sendEmail(subject, formData, formType) {
  const emailContent = generateEmailContent(formData, formType);

  // Log form data for manual email sending
  console.log('\n📧 NEW FORM SUBMISSION:');
  console.log('📋 Subject:', subject);
  console.log('📊 Form Type:', formType);
  console.log('📝 Form Data:', JSON.stringify(formData, null, 2));
  console.log('⏰ Time:', new Date().toLocaleString());
  console.log('📧 Send email to: worksunsysolar@gmail.com');
  console.log('--- END OF SUBMISSION ---\n');



  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: 'worksunsysolar@gmail.com',
    subject: subject,
    html: emailContent
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully for ${formType} form`);
    return { success: true, message: 'Form submitted successfully!' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Failed to submit form. Please try again.' };
  }
}

// Generate email content based on form type
function generateEmailContent(data, formType) {
  let content = '';

  // Common styles
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

// Residential Solar Form
app.post('/api/residential', async (req, res) => {
  try {
    const result = await sendEmail('🏠 Residential Solar Inquiry - Sunsy Solar', req.body, 'residential');
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Commercial Solar Form
app.post('/api/commercial', async (req, res) => {
  try {
    console.log('Commercial form data received:', req.body);
    const result = await sendEmail('🏢 Commercial Solar Inquiry - Sunsy Solar', req.body, 'commercial');
    res.json(result);
  } catch (error) {
    console.error('Commercial form error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Housing Society Form
app.post('/api/housing', async (req, res) => {
  try {
    const result = await sendEmail('🏘️ Housing Society Solar Inquiry - Sunsy Solar', req.body, 'housing');
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Maintenance Form
app.post('/api/maintenance', async (req, res) => {
  try {
    const result = await sendEmail('🔧 Solar Maintenance Request - Sunsy Solar', req.body, 'maintenance');
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Contact Form
app.post('/api/contact', async (req, res) => {
  try {
    const result = await sendEmail('📞 Contact Form Submission - Sunsy Solar', req.body, 'contact');
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Sunsy Solar Backend Server running on port ${PORT}`);
  console.log(`📧 Email service configured for: ${process.env.EMAIL_USER}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});
