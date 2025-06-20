const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { name, email, message } = JSON.parse(event.body);

  if (!name || !email || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Please fill in all fields.' }),
    };
  }

  // Use SendGrid, Mailgun, or any email API here
  // Example with SendGrid (replace SENDGRID_API_KEY and email addresses)

  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

  const sendGridData = {
    personalizations: [
      {
        to: [{ email: 'your-email@example.com' }],
        subject: 'New Contact Form Submission',
      },
    ],
    from: { email: 'no-reply@yourdomain.com' },
    content: [
      {
        type: 'text/plain',
        value: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      },
    ],
  };

  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sendGridData),
    });

    if (response.status === 202) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Email sent successfully.' }),
      };
    } else {
      const errorText = await response.text();
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to send email.', details: errorText }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
