import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL = process.env.FROM_EMAIL || 'info@chikox.net';
const APP_NAME = 'Chikox';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3001';

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetUrl = `${CLIENT_URL}/reset-password?token=${token}`;

  // Development fallback: log to console if no API key
  if (!resend) {
    console.log('\n========================================');
    console.log('PASSWORD RESET EMAIL (dev mode)');
    console.log('========================================');
    console.log(`To: ${email}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log('========================================\n');
    return;
  }

  try {
    await resend.emails.send({
      from: `${APP_NAME} <${FROM_EMAIL}>`,
      to: email,
      subject: 'Reset your password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f8f8;">
          <div style="background-color: #1a1a1a; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #E48F20; margin: 0; font-size: 28px; font-weight: bold;">${APP_NAME}</h1>
          </div>

          <div style="background: #ffffff; padding: 30px; border: 1px solid #dddddd; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333333; margin-top: 0;">Reset Your Password</h2>

            <p style="color: #666666;">You requested to reset your password. Click the button below to create a new password:</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: #E48F20; color: #1a1a1a; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
            </div>

            <p style="color: #666666; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="color: #E48F20; font-size: 14px; word-break: break-all;">${resetUrl}</p>

            <hr style="border: none; border-top: 1px solid #dddddd; margin: 30px 0;">

            <p style="color: #666666; font-size: 12px; margin-bottom: 0;">
              This link will expire in 1 hour. If you didn't request this password reset, you can safely ignore this email.
            </p>
          </div>

          <div style="text-align: center; padding: 20px; color: #666666; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
          </div>
        </body>
        </html>
      `
    });

    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
}

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const verifyUrl = `${CLIENT_URL}/verify-email?token=${token}`;

  // Development fallback: log to console if no API key
  if (!resend) {
    console.log('\n========================================');
    console.log('EMAIL VERIFICATION (dev mode)');
    console.log('========================================');
    console.log(`To: ${email}`);
    console.log(`Verify URL: ${verifyUrl}`);
    console.log('========================================\n');
    return;
  }

  try {
    await resend.emails.send({
      from: `${APP_NAME} <${FROM_EMAIL}>`,
      to: email,
      subject: 'Verify your email address',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f8f8;">
          <div style="background-color: #1a1a1a; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #E48F20; margin: 0; font-size: 28px; font-weight: bold;">${APP_NAME}</h1>
          </div>

          <div style="background: #ffffff; padding: 30px; border: 1px solid #dddddd; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333333; margin-top: 0;">Welcome to ${APP_NAME}!</h2>

            <p style="color: #666666;">Thank you for registering. Please verify your email address by clicking the button below:</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${verifyUrl}" style="background: #E48F20; color: #1a1a1a; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify Email</a>
            </div>

            <p style="color: #666666; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="color: #E48F20; font-size: 14px; word-break: break-all;">${verifyUrl}</p>

            <hr style="border: none; border-top: 1px solid #dddddd; margin: 30px 0;">

            <p style="color: #666666; font-size: 12px; margin-bottom: 0;">
              This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
            </p>
          </div>

          <div style="text-align: center; padding: 20px; color: #666666; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
          </div>
        </body>
        </html>
      `
    });

    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw new Error('Failed to send verification email');
  }
}
