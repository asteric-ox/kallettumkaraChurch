import nodemailer from 'nodemailer';

export interface HallBookingDetails {
  _id?: any;
  name: string;
  email: string;
  phone: string;
  event_type: string;
  booking_date: Date | string;
  start_time: string;
  end_time: string;
  time_slot: string;
  hall_type: string;
  amount: number;
  admin_remarks?: string;
}

const getTransporter = () => {
  const user = process.env.EMAIL_USER || 'kallettumkarachurch@gmail.com';
  const pass = (process.env.EMAIL_PASS || 'juzj pssa soac orkg').replace(/\s+/g, '');
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // SSL
    connectionTimeout: 8000, // 8s fail fast to prevent UI hanging
    greetingTimeout: 8000,
    socketTimeout: 10000,
    auth: {
      user,
      pass,
    },
  });
};

/**
 * Dispatch email via HTTPS Webhook/API (Bypasses Render free-tier SMTP port blocks)
 */
const sendViaHttpsRelay = async (payload: { to: string; subject: string; html: string; text: string }): Promise<boolean | null> => {
  const webhookUrl = process.env.GMAIL_WEBHOOK_URL || process.env.EMAIL_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      console.log('Sending email via HTTPS Google Apps Script / Webhook relay...');
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        console.log('Email successfully dispatched via HTTPS webhook relay!');
        return true;
      } else {
        const text = await response.text();
        console.warn('Webhook responded with non-200 status:', response.status, text);
      }
    } catch (err) {
      console.error('HTTPS Webhook dispatch error:', err);
    }
  }

  // Check for Brevo API Key
  const brevoKey = process.env.BREVO_API_KEY;
  if (brevoKey) {
    try {
      console.log('Sending email via Brevo HTTPS REST API...');
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: 'Infant Jesus Church Kallettumkara', email: process.env.EMAIL_USER || 'kallettumkarachurch@gmail.com' },
          to: [{ email: payload.to }],
          subject: payload.subject,
          htmlContent: payload.html,
          textContent: payload.text,
        }),
      });
      if (response.ok) {
        console.log('Email successfully sent via Brevo HTTPS API!');
        return true;
      }
    } catch (err) {
      console.error('Brevo API dispatch error:', err);
    }
  }

  // Check for Resend API Key
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      console.log('Sending email via Resend HTTPS REST API...');
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Infant Jesus Church <onboarding@resend.dev>',
          to: payload.to,
          subject: payload.subject,
          html: payload.html,
          text: payload.text,
        }),
      });
      if (response.ok) {
        console.log('Email successfully sent via Resend API!');
        return true;
      }
    } catch (err) {
      console.error('Resend API dispatch error:', err);
    }
  }

  return null; // No HTTPS relay configured
};


const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const formatAmount = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

/**
 * Send Booking Approval / Accepted Email
 */
export const sendBookingApprovalEmail = async (booking: HallBookingDetails) => {
  if (!booking.email) {
    console.warn('Cannot send approval email: No email provided for booking', booking._id);
    return false;
  }

  const formattedDate = formatDate(booking.booking_date);

  const formattedAmount = formatAmount(booking.amount);
  const bookingRef = booking._id ? String(booking._id).slice(-8).toUpperCase() : 'PENDING';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Approved</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f1115; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #e5e7eb;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f1115; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background: #181a20; border-radius: 16px; overflow: hidden; border: 1px solid rgba(212,175,55,0.25); box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1f1b13 0%, #2a2215 100%); padding: 36px 30px; text-align: center; border-bottom: 2px solid #d4af37;">
              <div style="font-size: 32px; line-height: 1; margin-bottom: 8px;">⛪</div>
              <h1 style="margin: 0; color: #d4af37; font-size: 24px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">Infant Jesus Church</h1>
              <p style="margin: 6px 0 0 0; color: #9ca3af; font-size: 13px; letter-spacing: 0.5px;">Kallettumkara, Thrissur, Kerala</p>
            </td>
          </tr>

          <!-- Status Banner -->
          <tr>
            <td style="padding: 24px 30px 10px 30px; text-align: center;">
              <div style="display: inline-block; background: rgba(34, 197, 94, 0.15); border: 1px solid #22c55e; color: #4ade80; padding: 8px 22px; border-radius: 9999px; font-weight: 700; font-size: 14px; letter-spacing: 0.05em; text-transform: uppercase;">
                ✓ Booking Confirmed & Approved
              </div>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 20px 30px 30px 30px;">
              <h2 style="margin: 0 0 12px 0; color: #ffffff; font-size: 20px; font-weight: 600;">Dear ${booking.name},</h2>
              <p style="margin: 0 0 24px 0; color: #d1d5db; font-size: 15px; line-height: 1.6;">
                We are delighted to inform you that your Parish Hall booking request has been <strong style="color: #4ade80;">Approved</strong> by the Church administration.
              </p>

              <!-- Booking Details Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #20242c; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 8px 0; color: #9ca3af; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; width: 40%;">Hall Reserved</td>
                        <td style="padding: 8px 0; color: #ffffff; font-size: 15px; font-weight: 700;">${booking.hall_type}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #9ca3af; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Hall Fee / Amount</td>
                        <td style="padding: 8px 0; color: #d4af37; font-size: 18px; font-weight: 800;">${formattedAmount}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #9ca3af; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Event Type</td>
                        <td style="padding: 8px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${booking.event_type}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #9ca3af; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Reserved Date</td>
                        <td style="padding: 8px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${formattedDate}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #9ca3af; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Timing</td>
                        <td style="padding: 8px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${booking.start_time} – ${booking.end_time} (${booking.time_slot})</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #9ca3af; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Booking Ref</td>
                        <td style="padding: 8px 0; color: #9ca3af; font-size: 13px; font-family: monospace;">#${bookingRef}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              ${booking.admin_remarks ? `
              <div style="background: rgba(212,175,55,0.08); border-left: 4px solid #d4af37; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px;">
                <p style="margin: 0; color: #d4af37; font-size: 12px; font-weight: 700; text-transform: uppercase;">Parish Office Note:</p>
                <p style="margin: 4px 0 0 0; color: #e5e7eb; font-size: 14px;">${booking.admin_remarks}</p>
              </div>
              ` : ''}

              <!-- Instructions -->
              <div style="background: rgba(255,255,255,0.03); border-radius: 12px; padding: 18px; margin-bottom: 24px; border: 1px solid rgba(255,255,255,0.05);">
                <h3 style="margin: 0 0 10px 0; color: #d4af37; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Important Guidelines & Payment</h3>
                <ul style="margin: 0; padding-left: 20px; color: #9ca3af; font-size: 13px; line-height: 1.7;">
                  <li>The total hall fee is <strong>${formattedAmount}</strong>. Please visit the church office to pay the advance/full amount.</li>
                  <li>Please retain this email or quote reference <strong>#${bookingRef}</strong> when communicating with the office.</li>
                  <li>For sound system, dining hall, or catering setup requirements, please inform the office at least 3 days in advance.</li>
                  <li>Hall premises must be kept clean and all church venue guidelines observed.</li>
                </ul>
              </div>

              <!-- Contact & Support -->
              <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 13px;">
                For any queries, please reach out to the parish office:
              </p>
              <p style="margin: 0; color: #d1d5db; font-size: 14px; font-weight: 500;">
                📞 <strong>+91 79091 51122</strong> &nbsp;|&nbsp; ✉️ <strong>kallettumkarachurch@gmail.com</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #121316; padding: 24px 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); color: #6b7280; font-size: 12px;">
              <p style="margin: 0 0 6px 0;">Infant Jesus Church, Kallettumkara, Thrissur District, Kerala - 680683</p>
              <p style="margin: 0;">This is an automated notification. Please do not reply directly to this email.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `
Infant Jesus Church, Kallettumkara
PARISH HALL BOOKING CONFIRMATION

Dear ${booking.name},

We are pleased to inform you that your booking for the Parish Hall has been APPROVED.

BOOKING DETAILS:
- Hall: ${booking.hall_type}
- Amount: ${formattedAmount}
- Event: ${booking.event_type}
- Date: ${formattedDate}
- Time: ${booking.start_time} - ${booking.end_time} (${booking.time_slot})
- Booking Reference: #${bookingRef}
${booking.admin_remarks ? `- Office Note: ${booking.admin_remarks}\n` : ''}

Please visit the church office to pay the hall rent of ${formattedAmount}.
Church Office: +91 79091 51122 | kallettumkarachurch@gmail.com
  `;

  const subject = `Booking Confirmed: Infant Jesus Church Hall - ${booking.event_type} (${formattedDate})`;

  // 1. Try HTTPS Relay first (Bypasses Render free-tier outbound port blocks)
  const relayResult = await sendViaHttpsRelay({
    to: booking.email,
    subject,
    html,
    text,
  });
  if (relayResult === true) {
    return true;
  }

  // 2. Fallback to Direct SMTP
  const transporter = getTransporter();
  try {
    const info = await transporter.sendMail({
      from: `"Infant Jesus Church Kallettumkara" <${process.env.EMAIL_USER || 'kallettumkarachurch@gmail.com'}>`,
      to: booking.email,
      subject,
      text,
      html,
    });
    console.log('Approval email sent successfully via SMTP:', info.messageId);
    return true;
  } catch (error: any) {
    console.error('Error sending approval email via SMTP:', error.message || error);
    if (error.code === 'ETIMEDOUT' || error.message?.includes('timeout') || error.code === 'ECONNECTION') {
      console.warn('NOTE: Render free-tier blocks outbound SMTP ports 25, 465, and 587. To send emails from Render without timeouts, add GMAIL_WEBHOOK_URL or an API key.');
    }
    return false;
  }
};

/**
 * Send Booking Rejection / Declined Email
 */
export const sendBookingRejectionEmail = async (booking: HallBookingDetails) => {
  if (!booking.email) {
    console.warn('Cannot send rejection email: No email provided for booking', booking._id);
    return false;
  }

  const formattedDate = formatDate(booking.booking_date);
  const formattedAmount = formatAmount(booking.amount);
  const bookingRef = booking._id ? String(booking._id).slice(-8).toUpperCase() : 'PENDING';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Request Update</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f1115; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #e5e7eb;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f1115; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background: #181a20; border-radius: 16px; overflow: hidden; border: 1px solid rgba(239,68,68,0.25); box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1f1b13 0%, #2a2215 100%); padding: 36px 30px; text-align: center; border-bottom: 2px solid #d4af37;">
              <div style="font-size: 32px; line-height: 1; margin-bottom: 8px;">⛪</div>
              <h1 style="margin: 0; color: #d4af37; font-size: 24px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">Infant Jesus Church</h1>
              <p style="margin: 6px 0 0 0; color: #9ca3af; font-size: 13px; letter-spacing: 0.5px;">Kallettumkara, Thrissur, Kerala</p>
            </td>
          </tr>

          <!-- Status Banner -->
          <tr>
            <td style="padding: 24px 30px 10px 30px; text-align: center;">
              <div style="display: inline-block; background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; color: #f87171; padding: 8px 22px; border-radius: 9999px; font-weight: 700; font-size: 14px; letter-spacing: 0.05em; text-transform: uppercase;">
                ✕ Booking Request Declined
              </div>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 20px 30px 30px 30px;">
              <h2 style="margin: 0 0 12px 0; color: #ffffff; font-size: 20px; font-weight: 600;">Dear ${booking.name},</h2>
              <p style="margin: 0 0 24px 0; color: #d1d5db; font-size: 15px; line-height: 1.6;">
                Thank you for your interest in booking the Parish Hall. We regret to inform you that we are unable to confirm your booking request for the requested date and time.
              </p>

              <!-- Booking Details Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #20242c; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 8px 0; color: #9ca3af; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; width: 40%;">Requested Hall</td>
                        <td style="padding: 8px 0; color: #ffffff; font-size: 15px; font-weight: 700;">${booking.hall_type}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #9ca3af; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Hall Rate</td>
                        <td style="padding: 8px 0; color: #9ca3af; font-size: 15px; font-weight: 600;">${formattedAmount}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #9ca3af; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Event Type</td>
                        <td style="padding: 8px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${booking.event_type}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #9ca3af; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Requested Date</td>
                        <td style="padding: 8px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${formattedDate}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #9ca3af; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Time Slot</td>
                        <td style="padding: 8px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${booking.start_time} – ${booking.end_time} (${booking.time_slot})</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #9ca3af; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Booking Ref</td>
                        <td style="padding: 8px 0; color: #9ca3af; font-size: 13px; font-family: monospace;">#${bookingRef}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Reason Note -->
              <div style="background: rgba(239,68,68,0.08); border-left: 4px solid #ef4444; padding: 14px 18px; border-radius: 4px; margin-bottom: 24px;">
                <p style="margin: 0; color: #f87171; font-size: 12px; font-weight: 700; text-transform: uppercase;">Reason / Parish Remarks:</p>
                <p style="margin: 6px 0 0 0; color: #e5e7eb; font-size: 14px; line-height: 1.5;">
                  ${booking.admin_remarks || 'The hall is unavailable due to pre-scheduled church services, maintenance, or prior reservations for this date.'}
                </p>
              </div>

              <!-- Alternate Options -->
              <div style="background: rgba(255,255,255,0.03); border-radius: 12px; padding: 18px; margin-bottom: 24px; border: 1px solid rgba(255,255,255,0.05);">
                <h3 style="margin: 0 0 8px 0; color: #d4af37; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Next Steps</h3>
                <p style="margin: 0; color: #9ca3af; font-size: 13px; line-height: 1.6;">
                  We apologize for any inconvenience. You are welcome to view our online availability calendar to check alternative open dates, or contact the parish office to check if a different time slot or hall can accommodate your gathering.
                </p>
              </div>

              <!-- Contact & Support -->
              <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 13px;">
                For further assistance, please contact the parish office:
              </p>
              <p style="margin: 0; color: #d1d5db; font-size: 14px; font-weight: 500;">
                📞 <strong>+91 79091 51122</strong> &nbsp;|&nbsp; ✉️ <strong>kallettumkarachurch@gmail.com</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #121316; padding: 24px 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); color: #6b7280; font-size: 12px;">
              <p style="margin: 0 0 6px 0;">Infant Jesus Church, Kallettumkara, Thrissur District, Kerala - 680683</p>
              <p style="margin: 0;">This is an automated notification. Please do not reply directly to this email.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `
Infant Jesus Church, Kallettumkara
PARISH HALL BOOKING UPDATE

Dear ${booking.name},

Thank you for your interest in booking the Parish Hall. We regret to inform you that your booking request could not be confirmed for the requested date.

BOOKING DETAILS:
- Requested Hall: ${booking.hall_type}
- Hall Rate: ${formattedAmount}
- Event: ${booking.event_type}
- Requested Date: ${formattedDate}
- Time: ${booking.start_time} - ${booking.end_time} (${booking.time_slot})
- Booking Reference: #${bookingRef}

Reason / Remarks: ${booking.admin_remarks || 'The hall is unavailable due to pre-scheduled church services, maintenance, or prior reservations.'}

You are welcome to select another available date on our website calendar or contact the parish office directly:
Church Office: +91 79091 51122 | kallettumkarachurch@gmail.com
  `;

  const subject = `Booking Request Update: Infant Jesus Church Hall - ${booking.event_type}`;

  // 1. Try HTTPS Relay first
  const relayResult = await sendViaHttpsRelay({
    to: booking.email,
    subject,
    html,
    text,
  });
  if (relayResult === true) {
    return true;
  }

  // 2. Fallback to Direct SMTP
  const transporter = getTransporter();
  try {
    const info = await transporter.sendMail({
      from: `"Infant Jesus Church Kallettumkara" <${process.env.EMAIL_USER || 'kallettumkarachurch@gmail.com'}>`,
      to: booking.email,
      subject,
      text,
      html,
    });
    console.log('Rejection email sent successfully via SMTP:', info.messageId);
    return true;
  } catch (error: any) {
    console.error('Error sending rejection email via SMTP:', error.message || error);
    if (error.code === 'ETIMEDOUT' || error.message?.includes('timeout') || error.code === 'ECONNECTION') {
      console.warn('NOTE: Render free-tier blocks outbound SMTP ports 25, 465, and 587. To send emails from Render without timeouts, add GMAIL_WEBHOOK_URL or an API key.');
    }
    return false;
  }
};

