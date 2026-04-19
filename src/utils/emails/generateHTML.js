export const signup = (otp) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Activation</title>
    <style>
        /* Inline styles for email compatibility */
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background-color: #007bff; color: #ffffff; padding: 20px; text-align: center; }
        .content { padding: 20px; text-align: center; }
        .button { display: inline-block; padding: 10px 20px; background-color: #28a745; color: #ffffff; text-decoration: none; border-radius: 5px; }
        .footer { background-color: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; color: #6c757d; }
    </style>
</head>
<body>
    <table class="container" width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td class="header">
                <h1>Welcome to Our Service!</h1>
            </td>
        </tr>
        <tr>
            <td class="content">
                <p>Thank you for signing up. Please click the button below to activate your account.</p>
                <a href="" class="button">${otp}</a>
                <p>If the button doesn't work, copy and paste this link into your browser: https://example.com/activate?token=YOUR_ACTIVATION_TOKEN</p>
            </td>
        </tr>
        <tr>
            <td class="footer">
                <p>If you didn't sign up, please ignore this email.</p>
                <p>&copy; 2023 Your Company. All rights reserved.</p>
            </td>
        </tr>
    </table>
</body>
</html>`

export const verifyEmail = (url) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Activation</title>
    <style>
        /* Inline styles for email compatibility */
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background-color: #007bff; color: #ffffff; padding: 20px; text-align: center; }
        .content { padding: 20px; text-align: center; }
        .button { display: inline-block; padding: 10px 20px; background-color: #28a745; color: #ffffff; text-decoration: none; border-radius: 5px; }
        .footer { background-color: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; color: #6c757d; }
    </style>
</head>
<body>
    <table class="container" width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td class="header">
                <h1>Welcome to Our Service!</h1>
            </td>
        </tr>
        <tr>
            <td class="content">
                <p>Thank you for signing up. Please click the button below to activate your account.</p>
                <a href="${url}" class="button">Verify your email</a>
                <p>If the button doesn't work, copy and paste this link into your browser: https://example.com/activate?token=YOUR_ACTIVATION_TOKEN</p>
            </td>
        </tr>
        <tr>
            <td class="footer">
                <p>If you didn't sign up, please ignore this email.</p>
                <p>&copy; 2023 Your Company. All rights reserved.</p>
            </td>
        </tr>
    </table>
</body>
</html>`