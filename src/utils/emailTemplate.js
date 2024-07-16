export const emailTemplatePerson = ({name}) => {
    return `
<!doctype html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0;"> 
<meta http-equiv="X-UA-Compatible" content="IE=edge" /> 
<meta name="format-detection" content="telephone=no" />
<title>Notify-Final</title> 
<!--[if !mso]><!-->
<link href="https://fonts.googleapis.com/css?family=Lato:300,400,400i,700,700i,900" rel="stylesheet">
<!--<![endif]-->
<style type="text/css">
body {
background-color: #ffffff;
-webkit-text-size-adjust: 100% !important;
-ms-text-size-adjust: 100% !important;
-webkit-font-smoothing: antialiased !important;
width: 100%;
height: 100%;
margin: 0;
padding: 0;
-webkit-font-smoothing: antialiased;
}
html {
background-color: #ffffff;
-webkit-text-size-adjust: 100% !important;
-ms-text-size-adjust: 100% !important;
-webkit-font-smoothing: antialiased !important;
width: 100%;
height: 100%;
margin: 0;
padding: 0;
-webkit-font-smoothing: antialiased;
}
img {
	border: 0 !important;
	outline: none !important;
}
p {
	Margin: 0px !important;
	Padding: 0px !important;
}
table {
	border-collapse: collapse;
	mso-table-lspace: 0px;
	mso-table-rspace: 0px;
}
td, a, span {
	border-collapse: collapse;
	mso-line-height-rule: exactly;
}
.ExternalClass * {
	line-height: 100%;
}
span.MsoHyperlink {
	mso-style-priority: 99;
	color: inherit;
}
span.MsoHyperlinkFollowed {
	mso-style-priority: 99;
	color: inherit;
}
.em_defaultlink a {
	color: inherit !important;
	text-decoration: none !important;
}
.rw_phone_layout .em_full_img {
	width: 100%;
	height: auto!important;
}
.rw_tablet_layout .em_full_img {
	width: 100%;
	height: auto!important;
}
.rw_phone_layout .em_hide, .rw_tablet_layout .em_hide {
	display: none!important;
}
.rw_phone_layout .em_pad, .rw_tablet_layout .em_pad {
	padding-left: 15px !important;
	padding-right: 15px !important;
}
</style>
<!-- @media only screen and (max-width: 640px) 
		   {*/
		   -->
<style type="text/css"> @media only screen and (max-width: 640px){
td[class=em_h1] { height:60px !important;  font-size:1px !important;  line-height:1px !important;}
table[class=myfull] {width:100% !important; max-width:300px!important; text-align:center!important;}
table[class=notify-5-wrap] {width:100% !important; max-width:400px;}
table[class=full] { width:100% !important;}
td[class=fullCenter] { width:100% !important; text-align:center!important}
td[class=em_hide] {display:none !important;}
table[class=em_hide] {display:none !important;}
span[class=em_hide] {display:none !important;}
br[class=em_hide] {display:none !important;}
img[class=em_full_img] {width:100% !important; height:auto !important;}
img[class="em_logo"] {text-align:center;}
td[class=em_center] {text-align:center !important;}
table[class=em_center] {text-align:center !important;}
td[class=em_h20] {height:20px !important;} 
td[class=em_h30] { height:30px !important;}
td[class=em_h40] { height:40px !important;}
td[class=em_h50] { height:50px !important;} 
td[class=em_pad] { padding-left:15px !important; padding-right:15px !important;} 
img[class=img125] { max-width:125px;}
table[class=small-center] { max-width:350px!important; text-align:center!important;}
td[class=em_autoHeight] {height:auto!important;}
td[class=winebg] { background:#b92547; -webkit-border-top-right-radius:5px!important; -moz-border-radius-topright:5px!important; border-top-right-radius:5px!important; -webkit-border-bottom-left-radius:0!important;-moz-border-radius-bottomleft:0!important; border-bottom-left-radius:0!important;}
td[class=myHeading]{font-size:24px!important; text-align:center!important; }
td[class=heading]{font-size:28px!important; text-align:center!important;line-height:35px; }
}
 </style>
<!--
@media only screen and (max-width: 479px) 
		   {
		   -->
<style type="text/css"> 
@media only screen and (max-width: 479px){	
table[class=full] {width:100% !important; max-width:100%!important;}
table[class=myfull] { width:100% !important;}
table[class=notify-5-wrap] {width:100% !important;}
table[class=em_wrapper] {width:100% !important;}
td[class=fullCenter] { width:100% !important; text-align:center!important}
td[class=em_aside] {width:10px !important;}
td[class=em_hide] { display:none !important;}
table[class=em_hide] {display:none !important;}
span[class=em_hide] {display:none !important;}
br[class=em_hide] {display:none !important;}
img[class=em_full_img] {width:100% !important;height:auto !important;}
img[class="em_logo"] {text-align:center;}
td[class=em_center] {text-align:center !important;}
table[class=em_center] {text-align:center !important;}
td[class=em_h20] {height:20px !important;}  
td[class=em_h30] {height:30px !important;}
td[class=em_h40] {height:40px !important;}
td[class=em_h50] {height:50px !important;} 
td[class=em_pad] {padding-left:10px !important;padding-right:10px !important;} 
table[class=em_btn] {width:130px !important;}
td[class=em_btn_text] {font-size:10px !important;height:26px !important;}
a[class=em_btn_text] {line-height:26px !important;}
td[class=em_h1] {height:60px !important;font-size:1px !important;line-height:1px !important;}
td[class=em_bg] {background:none !important;}
img[class=img125] {max-width:110px;height:auto!important;}
table[class=small-center] {max-width:100%!important;text-align:center!important;}
td[class=em_autoHeight] {height:auto!important;}
td[class=myHeading]{font-size:24px!important; text-align:center!important; color:#ff0000}
td[class=heading]{font-size:26px!important; text-align:center!important;line-height:35px; }
td[class=winebg] {background:#b92547; -webkit-border-top-right-radius:5px!important; -moz-border-radius-topright:5px!important; border-top-right-radius:5px!important; -webkit-border-bottom-left-radius:0!important;-moz-border-radius-bottomleft:0!important; border-bottom-left-radius:0!important;}
 
}
</style>

<!--[if mso]>
<style type="text/css">
body {
   font-family:arial, helvetica, sans-serif !important;
}

table {
   font-family:arial, helvetica, sans-serif !important;
}

td {
   font-family:arial, helvetica, sans-serif !important;
}

</style>
<![endif]-->


</head>

<body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  style="background-color: #ffffff;">

  <!-- Notify 3-->
  <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" class="full"  style="position: relative; left: 0px; top: 0px;">
    <tr>
      <td bgcolor="#bd9e6f" align="center" style="background-color: rgb(0, 0, 0);"><!-- Mobile Wrapper -->
        
        <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" class="full">
          <tr>
            <td width="100%" align="center">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td height="60" class="em_h1">&nbsp;</td>
                </tr>
              </table>
              <div class="sortable_inner ui-sortable">
                <table width="400" border="0" cellpadding="0" cellspacing="0" align="center" class="full" object="drag-module-small" style="position: relative; left: 0px; top: 0px;">
                  <tr>
                    <td align="center" width="400" valign="middle"><!-- Header Text -->
                      
                      <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="text-align: center; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;" class="fullCenter">
                        <tr>
                          <td valign="middle" width="100%" style="text-align: center;" class="fullCenter" ><a href="#" target="_blank" style="text-decoration:none;" cu-identify="element_0045055844496684205"><img class="em_logo mCS_img_loaded" src="https://res.cloudinary.com/dwblsxdfg/image/upload/v1721130848/companyApp/logoPNG_jzxued.png" alt="logo" width="150" height="63" border="0" style="text-align:center;"  cu-identify="element_006935063784175499"></a></td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                <table width="100%" border="0" cellspacing="0" cellpadding="0" object="drag-module-small">
                  <tr>
                    <td height="40" class="em_h40">&nbsp;</td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
        </table>
        <table width="400" border="0" cellpadding="0" cellspacing="0" align="center" class="full" style="max-width:400px!important">
          <tr>
            <td align="center" width="100%" valign="middle" class="em_pad">
              <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" class="full" style="border-top-right-radius: 5px; border-top-left-radius: 5px; ">
                <tr>
                  <td align="center" width="100%" valign="middle" bgcolor="#ffffff" style="border-radius: 5px; background-color: rgb(255, 255, 255); ">
                    <div class="sortable_inner ui-sortable">
                      <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" class="full" style="border-top-right-radius: 5px; border-top-left-radius: 5px;">
                        <tr>
                          <td align="center" valign="bottom" bgcolor="#2c2a2b" style="border-top-right-radius: 5px; border-top-left-radius: 5px;" ><img src="http://rocketway.net/templatebuilder/templates/notify3/images/img2.png" alt="" class="em_full_img mCS_img_loaded" border="0" style="vertical-align:bottom;" ></td>
                        </tr>
                      </table>
                      <table align="center" width="100%" border="0" cellspacing="0" cellpadding="0" object="drag-module-small">
                        <tr>
                          <td height="45" class="em_h40"><img src="http://rocketway.net/templatebuilder/templates/notify3/images/spacer.gif" width="1" alt="" height="1" border="0" style="display:block;" class="mCS_img_loaded"></td>
                        </tr>
                      </table>
                      <table width="290" border="0" cellpadding="0" cellspacing="0" align="center" class="full" object="drag-module-small">
                        <tr>
                          <td align="center" width="250" valign="middle" class="em_pad"><table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="text-align: center; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;" class="fullCenter">
                              <tr>
                                <td width="100%" align="center" style="font-size:30px; color:#161619; font-family:'Lato',Arial, sans-serif; font-weight:400; line-height:34px;"  >Thanks ${name} for your Registration!</td>
                              </tr>
                            </table></td>
                        </tr>
                      </table>
                      <table align="center" width="100%" border="0" cellspacing="0" cellpadding="0" object="drag-module-small">
                        <tr>
                          <td height="30" class="em_h30"><img src="http://rocketway.net/templatebuilder/templates/notify3/images/spacer.gif" width="1" alt="" height="1" border="0" style="display:block;" class="mCS_img_loaded"></td>
                        </tr>
                      </table>
                      <table width="290" border="0" cellpadding="0" cellspacing="0" align="center" class="full" object="drag-module-small" style="margin-bottom: 50px;">
                        <tr>
                          <td align="center" width="250" valign="middle" class="em_pad"><table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="text-align: center; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;" class="fullCenter">
                              <tr>
                                <td width="100%" align="center" style="font-size:15px; color:#ababab; font-family:'Lato',Arial, sans-serif; font-weight:400; line-height:23px;"  >We're glad you're here! Before you start  exploring YourCompany amazingness, we just need to confirm that you are a friendly human and not an evil robot: </td>
                              </tr>
                            </table></td>
                        </tr>
                      </table>

                      
                      <div style="display: none;" id="element_03164688699401288"></div>
                    </div>
                      <!-- End Button -->
                    
                    </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <table align="center" width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td height="40" class="em_h40"><img src="http://rocketway.net/templatebuilder/templates/notify3/images/spacer.gif" width="1" alt="" height="1" border="0" style="display:block;" class="mCS_img_loaded"></td>
          </tr>
        </table>
        <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
          <tr>
            <td align="center" valign="top"><!-- SORTABLE -->
              <table align="center" class="full" width="400" border="0" cellspacing="0" cellpadding="0" style="table-layout:fixed;" >
                <tr>
                  <td>
                    <div class="sortable_inner ui-sortable">
                      <table align="center" width="100%" border="0" cellspacing="0" cellpadding="0" object="drag-module-small" style="margin-bottom: 10px;">
                        <tr >
                          <td valign="top" align="center" style=" font-family:'Lato', Arial, sans-serif; font-weight:400; font-size:11px; color:#ffffff; line-height:22px;"   cu-identify="element_07930595852147182"> © 2024 <a style="color: white;" target="_blank" href="https://hyper-solution-media.vercel.app/">HSM.</a> All Rights Reserved.</td>
                        </tr>
                      </table>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  <!-- End of Notify 3-->
  
</div>
	
	
	`
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
  