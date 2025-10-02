const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send order approval email
exports.sendOrderApprovalEmail = async (userEmail, userName, orderDetails) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'SkyLens - Order Approved!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #22d3ee;">Order Approved!</h2>
          <p>Dear ${userName},</p>
          <p>Great news! Your order has been approved and we'll be in touch soon to schedule your drone filming session.</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Order Details:</h3>
            <p><strong>Location:</strong> ${orderDetails.location}</p>
            <p><strong>Package:</strong> ${orderDetails.package}</p>
            <p><strong>Date:</strong> ${orderDetails.date}</p>
            <p><strong>Time:</strong> ${orderDetails.time}</p>
          </div>
          <p>Thank you for choosing SkyLens!</p>
          <p>Best regards,<br>The SkyLens Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Order approval email sent successfully');
  } catch (error) {
    console.error('Error sending order approval email:', error);
  }
};

// Send order rejection email
exports.sendOrderRejectionEmail = async (userEmail, userName, orderDetails) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'SkyLens - Order Update',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">Order Update</h2>
          <p>Dear ${userName},</p>
          <p>We regret to inform you that your order could not be approved at this time. Please contact us for more information.</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Order Details:</h3>
            <p><strong>Location:</strong> ${orderDetails.location}</p>
            <p><strong>Package:</strong> ${orderDetails.package}</p>
            <p><strong>Date:</strong> ${orderDetails.date}</p>
            <p><strong>Time:</strong> ${orderDetails.time}</p>
          </div>
          <p>Please don't hesitate to reach out if you have any questions.</p>
          <p>Best regards,<br>The SkyLens Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Order rejection email sent successfully');
  } catch (error) {
    console.error('Error sending order rejection email:', error);
  }
};

