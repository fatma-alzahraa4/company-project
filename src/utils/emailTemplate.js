export const emailTemplatePerson = ({ subject }) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
    <style type="text/css">
    body{background-color: #88BDBF;margin: 0px;}
    </style>
    <body style="margin:0px;">
    <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
    <tr>
    <td>
    <table border="0" width="100%">
    <tr>
    <td>
    <h1>
        <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
    </h1>
    </td>
    <td>
    <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
    <tr>
    <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
    <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
    </td>
    </tr>
    <tr>
    <td>
    <h1 style="padding-top:25px; color:#630E2B">${subject}</h1>
    </td>
    </tr>
    <tr>
    <td>
    <p style="padding:0px 100px;">
    </p>
    </td>
    </tr>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <tr>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
    <tr>
    <td>
    <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
    </td>
    </tr>
    <tr>
    <td>
    <div style="margin-top:20px;">
  
    <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
  
    <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
    </a>
  
    <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
    </a>
  
    </div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </body>
    </html>`
}

export const emailTemplateCompany = ({ companyName, companyEmail, phoneNum, note, IPaddress, subService, subject, link, linkData }) => {
    return `<!DOCTYPE html>
         <html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
        <style type="text/css">
            body {
                background-color: #f4f4f4;
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 100%;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .email-wrapper {
                max-width: 600px;
                margin: auto;
                background-color: #ffffff;
                border: 1px solid #ddd;
                border-radius: 8px;
                overflow: hidden;
            }
            .header {
                background-color: #630E2B;
                color: #ffffff;
                padding: 20px;
                text-align: center;
            }
            .header img {
                width: 80px;
                height: 80px;
            }
            .content {
                padding: 30px;
            }
            .content h1 {
                color: #630E2B;
                font-size: 24px;
                margin-bottom: 20px;
            }
            .content p {
                color: #333333;
                font-size: 16px;
                line-height: 1.5;
                margin-bottom: 20px;
            }
            .content table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }
            .content table th, .content table td {
                text-align: left;
                padding: 8px;
                border: 1px solid #ddd;
            }
            .content table th {
                background-color: #f2f2f2;
            }
            .button {
                display: inline-block;
                background-color: #630E2B;
                color: #ffffff;
                padding: 10px 20px;
                border-radius: 4px;
                text-decoration: none;
                font-size: 16px;
                margin-top: 20px;
            }
            .footer {
                background-color: #f9f9f9;
                color: #666666;
                text-align: center;
                padding: 20px;
                font-size: 14px;
                border-top: 1px solid #ddd;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="email-wrapper">
                <div class="header">
                    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png" alt="Logo" />
                </div>
                <div class="content">
                    <h1>${subject}</h1>
                    <p>Here are the details of the new customer:</p>
                    <table>
                        <tr>
                            <th>Company Name</th>
                            <td>${companyName}</td>
                        </tr>
                        <tr>
                            <th>Company Email</th>
                            <td>${companyEmail}</td>
                        </tr>
                        <tr>
                            <th>Phone Number</th>
                            <td>${phoneNum}</td>
                        </tr>
                        <tr>
                            <th>Note</th>
                            <td>${note}</td>
                        </tr>
                        <tr>
                            <th>IP Address</th>
                            <td>${IPaddress}</td>
                        </tr>
                        <tr>
                            <th>Subscribed Service</th>
                            <td>${subService}</td>
                        </tr>
                    </table>
                    </div>
                    <div class="footer">
                    <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">${linkData}</a>

                </div>
            </div>
        </div>
    </body>
    </html>`;
};

export const emailTemplateAdmin = ({ link, linkData, subject }) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
    <style type="text/css">
    body{background-color: #88BDBF;margin: 0px;}
    </style>
    <body style="margin:0px;">
    <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
    <tr>
    <td>
    <table border="0" width="100%">
    <tr>
    <td>
    <h1>
        <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
    </h1>
    </td>
    <td>
    <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
    <tr>
    <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
    <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
    </td>
    </tr>
    <tr>
    <td>
    <h1 style="padding-top:25px; color:#630E2B">${subject}</h1>
    </td>
    </tr>
    <tr>
    <td>
    <p style="padding:0px 100px;">
    </p>
    </td>
    </tr>
    <tr>
    <td>
    <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">${linkData}</a>
    </td>
    </tr>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <tr>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
    <tr>
    <td>
    <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
    </td>
    </tr>
    
    </table>
    </td>
    </tr>
    </table>
    </body>
    </html>`
  }
  