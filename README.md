# Sunsy Solar Backend

Backend server for Sunsy Solar website with email functionality for form submissions.

## Features

- 📧 Email notifications for all form submissions
- 🏠 Residential solar inquiry handling
- 🏢 Commercial solar inquiry handling
- 🏘️ Housing society inquiry handling
- 🔧 Maintenance request handling
- 📞 Contact form handling
- 🛡️ CORS enabled for frontend integration
- 📝 Structured email templates

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Update the `.env` file with your Gmail credentials:

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=sunsysolar@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=Sunsy Solar <sunsysolar@gmail.com>
PORT=5000
```

### 3. Gmail App Password Setup

1. Enable 2-factor authentication on your Gmail account
2. Go to Google Account settings
3. Navigate to "Security" → "App passwords"
4. Generate a new app password
5. Use this password in the `EMAIL_PASS` field

### 4. Start the Server

For development:
```bash
npm run dev
```

For production:
```bash
npm start
```

## API Endpoints

### Form Submissions

All form submissions send emails to `sunsysolar@gmail.com` with structured formatting.

#### Residential Solar
- **POST** `/api/residential`
- **Body**: `{ name, email, phone, location, message }`

#### Commercial Solar
- **POST** `/api/commercial`
- **Body**: `{ name, email, phone, company, businessType, message }`

#### Housing Society
- **POST** `/api/housing`
- **Body**: `{ name, email, phone, societyName, buildings, message }`

#### Maintenance
- **POST** `/api/maintenance`
- **Body**: `{ name, phone, location, pincode, kilowatt, panels }`

#### Contact Form
- **POST** `/api/contact`
- **Body**: `{ name, email, phone, subject, message, newsletter }`

### Health Check

- **GET** `/api/health`
- Returns server status

## Response Format

All form endpoints return:
```json
{
  "success": true,
  "message": "Form submitted successfully!"
}
```

Or on error:
```json
{
  "success": false,
  "message": "Failed to submit form. Please try again."
}
```

## Email Templates

Each form type has a customized email template with:
- Professional formatting
- Form-specific icons and headers
- Structured data display
- Timestamp submission
- Responsive design

## Frontend Integration

Configure your frontend to make POST requests to:
- Development: `http://localhost:5000/api/[endpoint]`
- Production: `https://your-domain.com/api/[endpoint]`

Example fetch call:
```javascript
const response = await fetch('http://localhost:5000/api/residential', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(formData)
});

const result = await response.json();
```

## Security Notes

- Always use HTTPS in production
- Never commit `.env` file to version control
- Use app-specific passwords for Gmail
- Consider rate limiting for production deployment
- Validate input data on both client and server side
