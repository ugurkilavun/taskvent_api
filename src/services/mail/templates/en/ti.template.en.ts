export const teamInviteTemplate_en = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Project Invitation</title>
  <style>
    body {
      font-family: "Segoe UI", Roboto, Arial, sans-serif;
      background-color: #f4f6f8;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
    }
    .header {
      background: linear-gradient(135deg, #4f46e5, #6366f1);
      color: #fff;
      text-align: center;
      padding: 24px;
    }
    .header h1 {
      margin: 0;
      font-size: 22px;
    }
    .content {
      padding: 30px;
      text-align: center;
    }
    .content p {
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .btn {
      display: inline-block;
      background: #4f46e5;
      color: #fff !important;
      text-decoration: none;
      padding: 12px 28px;
      border-radius: 8px;
      font-weight: 600;
      margin: 5px;
      transition: background 0.3s ease;
    }
    .btn:hover {
      background: #4338ca;
    }
    .btn-reject {
      background: #e11d48;
    }
    .btn-reject:hover {
      background: #be123c;
    }
    .footer {
      text-align: center;
      font-size: 13px;
      color: #777;
      padding: 20px;
      border-top: 1px solid #eee;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Project Invitation</h1>
    </div>
    <div class="content">
      <p>Hello <strong>{{name}}</strong>,</p>
      <p>
        <strong>{{inviterName}}</strong> has invited you to join the
        <strong>{{teamTitle}}</strong> team.
      </p>
      <p>Your role: <strong>{{role}}</strong></p>
      <p>You can use the buttons below to accept or reject the invitation:</p>

      <a href="{{acceptUrl}}" class="btn">Accept</a>
      <a href="{{rejectUrl}}" class="btn btn-reject">Reject</a>

      <p style="margin-top: 30px; font-size: 14px; color: #555;">
        If you were not expecting this invitation, you can safely ignore this email.
      </p>
    </div>
    <div class="footer">
      © {{year}} {{appName}} • All rights reserved.
    </div>
  </div>
</body>
</html>
`;