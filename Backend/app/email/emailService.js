const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
const CONFIG = require('../../config');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(CONFIG.SENDGRID_KEY);

const template = path.join(__dirname, '../../app/views/emailtemplate.ejs'); // Modify this line
// Read the EJS template file synchronously
const emailTemplatePath = fs.readFileSync(template, 'utf-8');

const passwordTemplate = path.join(__dirname, '../../app/views/passwordTemplate.ejs'); // Modify this line
// Read the EJS template file synchronously
const passwordTemplatePath = fs.readFileSync(passwordTemplate, 'utf-8');

const referralTemplate = path.join(__dirname, '../../app/views/referralTemplate.ejs'); // Modify this line
// Read the EJS template file synchronously
const referralTemplatePath = fs.readFileSync(referralTemplate, 'utf-8');

const serviceAccount = require('../../serviceAccountKey.json');


// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://course-9c5ef-default-rtdb.firebaseio.com',
});

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: CONFIG.SMTPSERVICE,
  auth: {
    user: CONFIG.SMTPUSER,
    pass: CONFIG.SMTPPASS,
  },
});

// Function to send email verification
const sendVerificationEmail = async (firstName,email, verificationToken) => {
  try {
    // Check if the user exists
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(email);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // User not found, create a new user
        userRecord = await admin.auth().createUser({
          email: email,
          emailVerified: false,
        });
      } else {
        // Other errors, handle accordingly
        throw error;
      }
    }

    // Check if the user is not already verified
    if (!userRecord.emailVerified) {
      const actionCodeSettings = {
        // url: `http://localhost:8080/verify?token=${verificationToken}`,
        url : `${CONFIG.BACKENDURL}/verify?token=${verificationToken}`,
        handleCodeInApp: true,
      };

      // Generate email verification link
      const verificationLink = await admin.auth().generateEmailVerificationLink(email, actionCodeSettings);

      // Render the template with dynamic data
      const emailTemplate = await ejs.render(emailTemplatePath, { firstName,verificationLink });
      console.log(emailTemplate, "ggffffdddddggg");
      // const emailTemplate = await ejs.renderFile('verificationEmailTemplate.ejs', { verificationLink });
      // Send the email using nodemailer
      const mailOptions = {
        from: 'noreply@gmail.com',
        to: email,
        subject: 'Verify Your Email',
        // html: `Click <a href="${verificationLink}">here</a> to verify your email.`,
        html:emailTemplate
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
    } else {
      console.log('User is already verified.');
      // Optionally, inform the user that they are already verified.
    }
  } catch (error) {
    console.error('Error:', error);

    if (error.code === 'auth/user-not-found') {
      console.error('User not found. Cannot generate email verification link.');
      // Optionally, inform the user that their account doesn't exist.
    } else {
      console.error('Error generating or sending email verification link:', error);
    }
  }
};

// const sendResetPasswordEmail = (email, verificationToken) => {
//   const transporter = nodemailer.createTransport({
//     service: `${CONFIG.SMTPSERVICE}`,
//     auth: {
//       user: `${CONFIG.SMTPUSER}`, // Replace with your Gmail email address
//       pass: `${CONFIG.SMTPPASS}`, // Replace with your Gmail password or App Password
//     },
//   });

//   const verificationLink = `${CONFIG.FRONTEND_URL}/#/reset-password?token=${verificationToken}`;

//   const mailOptions = {
//     from: 'noreply@gmail.com',
//     to: email,
//     subject: 'Reset Your Password',
//     html: `Click <a href="${verificationLink}">here</a> to reset your password`,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });
// };
// const sendResetPasswordEmail = async (email, verificationToken) => {
//   try {
//     // Check if the user exists
//     let userRecord;
//     try {
//       userRecord = await admin.auth().getUserByEmail(email);
//     } catch (error) {
//       if (error.code === 'auth/user-not-found') {
//         // User not found, create a new user
//         userRecord = await admin.auth().createUser({
//           email: email,
//           emailVerified: false,
//         });
//       } else {
//         // Other errors, handle accordingly
//         throw error;
//       }
//     }

//     const actionCodeSettings = {
//       url: `${CONFIG.FRONTEND_URL}/reset-password?token=${verificationToken}`,
//       handleCodeInApp: true,
//     };

//     // Generate password reset link
//     const resetPasswordLink = await admin.auth().generatePasswordResetLink(email, actionCodeSettings);

//     // Render the template with dynamic data
//     const emailTemplate = await ejs.render(passwordTemplatePath, { resetPasswordLink });

//     // Send the email using nodemailer
//     // const transporter = nodemailer.createTransport({
//     //   service: `${CONFIG.SMTPSERVICE}`,
//     //   auth: {
//     //     user: `${CONFIG.SMTPUSER}`, // Replace with your email service username
//     //     pass: `${CONFIG.SMTPPASS}`, // Replace with your email service password
//     //   },
//     // });

//     const mailOptions = {
//       from: 'noreply@gmail.com',
//       to: email,
//       subject: 'Reset Your Password',
//       html: emailTemplate,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log('Email sent:', info.response);
//   } catch (error) {
//     console.error('Error:', error);

//     if (error.code === 'auth/user-not-found') {
//       console.error('User not found. Cannot generate password reset link.');
//       // Optionally, inform the user that their account doesn't exist.
//     } else {
//       console.error('Error generating or sending password reset link:', error);
//     }
//   }
// };

const sendResetPasswordEmail = async (email, verificationToken) => {

  
    const transporter = nodemailer.createTransport({
        service: `${CONFIG.SMTPSERVICE}`,
        auth: {
            user: `${CONFIG.SMTPUSER}`, // Replace with your Gmail email address
            pass: `${CONFIG.SMTPPASS}`,        // Replace with your Gmail password or App Password
        },
    });

    const resetPasswordLink = `${CONFIG.FRONTEND_URL}/reset-password?token=${verificationToken}`;
    const emailTemplate = await ejs.render(passwordTemplatePath, { resetPasswordLink });
    const mailOptions = {
      from: 'noreply@gmail.com',
      to: email,
      subject: 'Reset Your Password',
      html: emailTemplate,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

  // try {
  //   const actionCodeSettings = {
  //     url: `${CONFIG.BACKENDURL}/reset-password?token=${verificationToken}`, // Redirect URL with token query parameter
  //     handleCodeInApp: true,
  //   };

  //   // Generate password reset link
  //   const resetPasswordLink = await admin.auth().generatePasswordResetLink(email, actionCodeSettings);

  //   // Render the template with dynamic data
  //   const emailTemplate = await ejs.render(passwordTemplatePath, { resetPasswordLink });

  //   // Send the email using Nodemailer or your preferred email service
  //   const transporter = nodemailer.createTransport({
  //     service: `${CONFIG.SMTPSERVICE}`,
  //     auth: {
  //       user: `${CONFIG.SMTPUSER}`, // Replace with your email service username
  //       pass: `${CONFIG.SMTPPASS}`, // Replace with your email service password
  //     },
  //   });

  //   const mailOptions = {
  //     from: 'noreply@gmail.com',
  //     to: email,
  //     subject: 'Reset Your Password',
  //     html: emailTemplate,
  //   };

  //   const info = await transporter.sendMail(mailOptions);
  //   console.log('Email sent:', info.response);
  // } catch (error) {
  //   console.error('Error:', error);

  //   if (error.code === 'auth/user-not-found') {
  //     console.error('User not found. Cannot generate password reset link.');
  //     // Optionally, inform the user that their account doesn't exist.
  //   } else {
  //     console.error('Error generating or sending password reset link:', error);
  //   }
  // }
};


async function sendReferralEmail(refereeEmail, referrerName,courseName,referralCode) {
  try {
    const referralEmailTemplate = await ejs.render(referralTemplatePath, {referrerName,courseName,referralCode });
    // Send mail with defined transport object
    const info = {
      to: refereeEmail, // List of receivers
      from: 'abrahim.webpaint@gmail.com', // Sender address
      subject: 'You have been referred!', // Subject line
      html: referralEmailTemplate // Plain text body
    };
    await sgMail.send(info);
    

    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

async function sendPasswordByEmailInstructor(email, password) {
  try {
    // Construct email template
    const emailTemplate = `
      <p>Dear Instructor,</p>
      <p>You have been provided with a password to access your account ${email}:</p>
      <p><strong>Password:</strong> ${password}</p>
      <p>Please use this password to log in to your account.</p>
      <p>Thank you.</p>
    `;

    // Send mail with defined transport object
    const info = {
      to: email,
      from: 'abrahim.webpaint@gmail.com',
      subject: 'Your account password',
      html: emailTemplate,
    };

    // Send email
    await sgMail.send(info);

    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

module.exports = { sendVerificationEmail, sendResetPasswordEmail,sendReferralEmail,sendPasswordByEmailInstructor };
