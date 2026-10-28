export const projectInviteRejectedTemplate_tr = `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Proje Daveti Reddedildi</title>
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
      background: linear-gradient(135deg, #e11d48, #f43f5e);
      color: #fff;
      text-align: center;
      padding: 28px 24px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 32px;
      text-align: center;
    }
    .icon {
      width: 72px;
      height: 72px;
      margin: 0 auto 20px;
      border-radius: 50%;
      background: rgba(225, 29, 72, 0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 34px;
      color: #e11d48;
      font-weight: bold;
    }
    .content p {
      font-size: 16px;
      line-height: 1.7;
      margin-bottom: 20px;
    }
    .highlight {
      color: #e11d48;
      font-weight: 700;
    }
    .info-box {
      background: #fff1f2;
      border: 1px solid #fecdd3;
      border-radius: 10px;
      padding: 18px;
      margin-top: 24px;
      color: #be123c;
      font-size: 15px;
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
      <h1>Davet Reddedildi</h1>
    </div>

    <div class="content">
      <div class="icon">✕</div>

      <p>Merhaba <strong>{{inviterName}}</strong>,</p>

      <p>
        <strong>{{teamName}}</strong> takım sahibi,
        <span class="highlight">{{projectTitle}}</span>
        projesi için gönderdiğin daveti reddetti.
      </p>

      <div class="info-box">
        İstersen daha sonra farklı bir takım veya kullanıcıya yeniden davet gönderebilirsin.
      </div>
    </div>

    <div class="footer">
      © {{year}} {{appName}} • Tüm hakları saklıdır.
    </div>
  </div>
</body>
</html>
`;