const nodemailer = require('nodemailer');

// Create transporter with updated configuration
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, // Change from 465 to 587 for TLS
    secure: false, // Set to false for TLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false // Only use during development
    },
    debug: true,
    logger: true
});

// Verify transporter configuration
const verifyConnection = async () => {
    try {
        await transporter.verify();
        console.log('Email service is ready');
        return true;
    } catch (error) {
        console.error('Email service error:', error);
        return false;
    }
};

// Email template for registration confirmation
const getRegistrationEmailTemplate = (registration) => {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4CAF50;">TimeFest 2024 - Registration Confirmed!</h2>
            
            <p>Dear ${registration.name},</p>
            
            <p>Thank you for registering for TimeFest 2024! Your registration has been confirmed.</p>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Registration Details:</h3>
                <p><strong>Ticket Type:</strong> ${registration.ticketType}</p>
                <p><strong>Quantity:</strong> ${registration.quantity}</p>
                <p><strong>Total Amount:</strong> $${registration.totalAmount}</p>
                <p><strong>Registration ID:</strong> ${registration._id}</p>
            </div>
            
            <p>Event Details:</p>
            <ul>
                <li>Date: February 11, 2025</li>
                <li>Venue: TimeFest Arena</li>
                <li>Check-in Time: 10:00 AM</li>
            </ul>
            
            <p>Important Notes:</p>
            <ul>
                <li>Please bring a valid ID for check-in</li>
                <li>Your registration confirmation email serves as your ticket</li>
                <li>Each ticket includes access to all events in the selected era</li>
            </ul>
            
            <p>If you have any questions, please contact us at support@timefest2024.com</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p style="color: #666; font-size: 12px;">
                    This is an automated message. Please do not reply to this email.
                </p>
            </div>
        </div>
    `;
};

// Send registration confirmation email with better error handling
const sendRegistrationEmail = async (registration) => {
    try {
        console.log('Attempting to send email to:', registration.email);
        console.log('Using email configuration:', {
            from: process.env.EMAIL_USER,
            // Don't log the password!
        });

        const mailOptions = {
            from: `"TimeFest 2024" <${process.env.EMAIL_USER}>`,
            to: registration.email,
            subject: 'TimeFest 2024 - Registration Confirmed!',
            html: getRegistrationEmailTemplate(registration),
            text: getPlainTextEmail(registration) // Fallback plain text version
        };

        // Verify connection before sending
        await verifyConnection();

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Response:', info.response);
        return true;
    } catch (error) {
        console.error('Detailed email error:', {
            message: error.message,
            code: error.code,
            command: error.command,
            response: error.response,
            responseCode: error.responseCode,
            stack: error.stack
        });
        throw error;
    }
};

// Add a plain text version of the email
const getPlainTextEmail = (registration) => {
    return `
TimeFest 2024 - Registration Confirmed!

Dear ${registration.name},

Thank you for registering for TimeFest 2024! Your registration has been confirmed.

Registration Details:
- Ticket Type: ${registration.ticketType}
- Quantity: ${registration.quantity}
- Total Amount: $${registration.totalAmount}
- Registration ID: ${registration._id}

Event Details:
- Date: February 11, 2025
- Venue: TimeFest Arena
- Check-in Time: 10:00 AM

Important Notes:
- Please bring a valid ID for check-in
- Your registration confirmation email serves as your ticket
- Each ticket includes access to all events in the selected era

If you have any questions, please contact us at support@timefest2024.com

This is an automated message. Please do not reply to this email.
    `;
};

module.exports = {
    sendRegistrationEmail,
    verifyConnection
}; 