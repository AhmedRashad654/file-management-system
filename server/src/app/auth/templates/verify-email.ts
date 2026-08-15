export function verificationCodeEmail(code: string): { subject: string; html: string } {
  const subject = "Verify Your Email - File Management System";

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f9f9f9;
          color: #333333;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          border: 1px solid #eaeaea;
        }
        .header {
          background-color: #2563eb;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          color: #ffffff;
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }
        .content {
          padding: 40px 30px;
          line-height: 1.6;
          text-align: center;
        }
        .content p {
          font-size: 16px;
          color: #555555;
          margin-bottom: 30px;
        }
        .code-box {
          display: inline-block;
          background-color: #f3f4f6;
          border: 2px dashed #2563eb;
          color: #2563eb;
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 6px;
          padding: 15px 40px;
          border-radius: 8px;
          margin: 10px 0 30px 0;
        }
        .footer {
          background-color: #f1f1f1;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #888888;
          border-top: 1px solid #eaeaea;
        }
        .warning {
          font-size: 13px;
          color: #999999;
          margin-top: 20px;
          border-top: 1px solid #eeeeee;
          padding-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>File Management System</h1>
        </div>

        <div class="content">
          <h2>Email Verification</h2>
          <p>Thank you for signing up. Use the verification code below to activate your account. This code is valid for 15 minutes only.</p>

          <div class="code-box">${code}</div>

          <p class="warning">If you didn't create an account, you can safely ignore this email.</p>
        </div>

        <div class="footer">
          <p>&copy; 2026 File Management System. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}
