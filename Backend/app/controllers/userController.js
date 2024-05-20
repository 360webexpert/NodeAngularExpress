const db = require("../model");
const jwt = require('jsonwebtoken');
const users = db.user;
const Course = db.addCourse;
const UserCourse = db.userCourse;
const createusercheckout = db.createusercheckout;
const Referral = db.referral;
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const fs = require('fs');

const { sendVerificationEmail, sendResetPasswordEmail, sendReferralEmail } = require('../email/emailService');
const authenticateToken = require("./authController");
const { TOKEN_SECRET, STRIPE_SECRET_KEY } = require("../../config");
const csv = require('csv-parser'); 
const firebase = require('firebase/app');
const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
require('firebase/auth');

// Your Firebase configuration
const stripe = require('stripe')(STRIPE_SECRET_KEY)
const firebaseConfig = {
  apiKey: "AIzaSyA-ASCBaK66Xt3_96fX5WPujtWg8ppOBSk",
  authDomain: "course-9c5ef.firebaseapp.com",
  databaseURL: "https://course-9c5ef-default-rtdb.firebaseio.com",
  projectId: "course-9c5ef",
  storageBucket: "course-9c5ef.appspot.com",
  messagingSenderId: "701052805244",
  appId: "1:701052805244:web:14d101a906b4bc23bbe9f9",
  measurementId: "G-EY0TJ16Q74"
  
  // ... other configuration properties
};

let auth; // Declare auth in a scope accessible to the create function

try {
  const firebaseApp = initializeApp(firebaseConfig);
  auth = getAuth(firebaseApp);
} catch (error) {
  console.error('Firebase initialization error', error);
}

exports.create = async (req, res) => {
  try {
    // Validate request
    if (!req.body) {
      return res.status(400).send({
        message: "Data must be provided in the request body."
      });
    }

    const verificationToken = uuid.v4();

    // Check if the email is already registered
    const existingUserInfo = await users.findOne({ where: { email: req.body.email } });

    if (existingUserInfo) {
      return res.status(403).send({ message: "Email already registered, try with a different one" });
    }

    // Create a user in Firebase
    const { email, password } = req.body;
    const firebaseUserCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Create a local user
    const useinfo = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      phoneNumber: req.body.phoneNumber,
      addressLane1: req.body.addressLane1,
      addressLane2: req.body.addressLane2,
      city: req.body.city,
      state: req.body.state,
      zipCode: req.body.zipCode,
      country: req.body.country,
      interestedInInternship: req.body.interestedInInternship,
      universityName: req.body.universityName,
      otherUniversityName: req.body.otherUniversityName,
      currentProgram: req.body.currentProgram,
      graduatingYear: req.body.graduatingYear,
      alreadyGraduated: req.body.alreadyGraduated||false,
      schoolEmail: req.body.schoolEmail,
      verificationToken,
      isVerified: false,
    };

    // Save to the local database
    await users.create(useinfo);

    // Send verification email (Replace with your actual sendVerificationEmail function)
    sendVerificationEmail(useinfo.firstName, email, verificationToken);

    res.status(200).send({ status: 200, data: firebaseUserCredential.user });
  } catch (err) {

    console.log(err,'jfkfskfhdkfh')
    if (err.message.includes('auth/email-already-in-use')) {
      console.log('err.message', err.message)
      res.status(500).send({

        message: 'Email already registered'
      })
    } else {

      res.status(500).send({

        message: "Some error occurred while creating the user."
      })
    }
  }
};



// Login function
exports.login = (req, res) => {
  const { email, password } = req.body;
  // Validate request
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }
  // Check if the user with the given email exists
  users?.findOne({ where: { email: email } })
    .then((user) => {
      if (user) {
        // Check if the user's email is verified
        if (user.isVerified) {
          // Use bcrypt to compare the provided password with the hashed password in the database
          if (bcrypt.compareSync(password, user.password)) {
            // Passwords match, generate a JWT token for the user
            const token = jwt.sign({ id: user.id, email: user.email }, TOKEN_SECRET);

            res.status(200).json({ token: token, data: user });



          } else {
            // Passwords do not match
            res.status(401).json({ message: "Invalid password." });
          }
        } else {
          res.status(401).json({ message: "Email not verified. Please verify your email." });
        }
      } else {
        res.status(404).json({ message: "Email not found." });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Internal server error." });
    });
};



exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await users.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const resetToken = uuid.v4();
    const resetExpiry = new Date();
    resetExpiry.setHours(resetExpiry.getHours() + 1); // Example: Set expiry time to 1 hour from now

    await user.update({
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpiry,
    });

    sendResetPasswordEmail(user.email, resetToken); // Implement this function to send the reset email

    return res.status(200).json({ message: 'Reset password email sent successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// Reset Password - Validates the token and updates the password
exports.resetPassword = (req, res) => {
  const { token, newPassword } = req.body;

  // Validate request
  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token and new password are required." });
  }

  // Find the user by the reset token and check if it's still valid
  users?.findOne({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: { [db.Sequelize.Op.gt]: new Date() }
    }
  })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token." });
      }

      // Hash the new password
      const hashedPassword = bcrypt.hashSync(newPassword, 10);

      // Update the user's password and reset token
      users?.update(
        { password: hashedPassword, resetPasswordToken: null, resetPasswordExpires: null },
        { where: { id: user.id } }
      )
        .then(() => {
          res.status(200).json({ message: "Password reset successfully." });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ message: "Internal server error." });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Internal server error." });
    });
};


// exports.resetPassword = async (req, res) => {
//   const { token, newPassword } = req.body;

//   // Validate request
//   if (!token || !newPassword) {
//     return res.status(400).json({ message: "Token and new password are required." });
//   }

//   try {
//     // Find the user by the reset token and check if it's still valid
//     const user = await users.findOne({
//       where: {
//         resetPasswordToken: token,
//         resetPasswordExpires: { [db.Sequelize.Op.gt]: new Date() },
//       },
//     });

//     if (!user) {
//       return res.status(400).json({ message: "Invalid or expired token." });
//     }

//     // Hash the new password
//     const hashedPassword = bcrypt.hashSync(newPassword, 10);

//     // Update the user's password and reset token
//     await users.update(
//       { password: hashedPassword, resetPasswordToken: null, resetPasswordExpires: null },
//       { where: { id: user.id } }
//     );

//     // Update the password in Firebase (assuming you have a function for this)
//     await updatePasswordInFirebase(user.email, newPassword);

//     res.status(200).json({ message: "Password reset successfully." });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error." });
//   }
// };

const updatePasswordInFirebase = async (email, newPassword) => {
  try {
    // Use Firebase Admin SDK to update the user's password
    await admin.auth().updateUserByEmail(email, {
      password: newPassword,
    });

    console.log('Password updated in Firebase successfully.');
  } catch (error) {
    console.error('Error updating password in Firebase:', error);
    // Handle error accordingly
    throw error;
  }
};

// Find all users
exports.getUsers = [authenticateToken, (req, res) => {


  users.findAll()
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: 'Cannot find users',
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error retrieving users',
      });
    });
},
];




// Find a single user with an id
exports.getUserByToken = [authenticateToken, (req, res) => {
  console.log('req', req.userId)
  const id = req.userId;
  users.findOne({
    where: {
      id: id,
    },
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: 'Cannot find user',
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error retrieving user with id=' + id,
      });
    });
},
];
exports.getUserById = (req, res) => {
  console.log('req', req.params.userId); // Retrieve the user ID from the URL parameters
  const id = req.params.userId; // Assign the user ID to the id variable
  // Use the user ID to query the database
  users.findOne({
      where: {
        id: id,
      },
    })
    .then(data => {
      if (data) {
        res.send(data); // Send the user data back as a response
      } else {
        res.status(404).send({
          message: 'Cannot find user',
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error retrieving user with id=' + id,
      });
    });
};

exports.update = [
  authenticateToken, (req, res) => {
    const id = req.params.id;

    users.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            staus: 200,
            message: "user was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update user with id=${id}. Maybe user was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating user with id=" + id
        });
      });
  }
]

exports.deleteUser = 
 (req, res) => {
    const id = req.params.id;

    users.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.status(200).json({
            status: 200,
            message: "User was deleted successfully."
          });
        } else {
          res.status(404).json({
            status: 404,
            message: `Cannot delete user with id=${id}. Maybe user was not found.`
          });
        }
      })
      .catch(err => {
        res.status(500).json({
          status: 500,
          message: "Error deleting user with id=" + id
        });
      });
  }



exports.createUserCheckout = [authenticateToken, async (req, res) => {
  console.log('req.body', req.body);
  if (!req.body) {
    return res.status(400).send({
      message: "Data must be provided in the request body."
    });
  }
  try {
    const { amount, currency, email, userName, address, country, state, city, Zip, token, courseTitle, courseId, userId } = req.body;
    // Create a PaymentMethod using the token
    const existingCheckout = await createusercheckout.findOne({ where: { userId, courseId } });
    if (existingCheckout) {
      return res.status(400).send({
        message: "You have already purchased this course."
      });
    }

    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        token: token,
      },
    });
    // Create a PaymentIntent using the PaymentMethod
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method: paymentMethod.id,
      description: `Payment for ${userName}'s purchase`,
      shipping: {
        name: userName,
        address: {
          line1: address,
          postal_code: Zip,
          city: city,
          state: state,
          country: country,
        },
      },
      metadata: {
        customerName: userName,
        email: email,
        // You can add more metadata fields as needed
      },
    });
    if (paymentIntent) {
      // Create the checkout entry
      const checkout = await createusercheckout.create({
        amount, currency, email, userName, address, country, state, city, Zip, token, courseTitle, courseId, userId
      });
      console.log('Checkout created:', checkout);
    }
    // Send client secret to the frontend
    res.status(201).send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating PaymentIntent:', error.message);
    res.status(500).send({ error: error.message });
  }
}];


exports.getAllCheckouts = [authenticateToken, async (req, res) => {
  try {
    const checkouts = await createusercheckout.findAll();
    console.log('checkouts', checkouts)
    return res.status(200).json(checkouts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
]
exports.createUserCourse = [authenticateToken, async (req, res) => {

  const { userId, courseId, coursePrice, courseTitle, courseDescription, courseImage } = req.body;

  try {
    // Check if the user and course exist
    const user = await users.findByPk(userId);
    const course = await Course.findByPk(courseId);

    if (!user || !course) {
      return res.status(404).json({ error: 'User or course not found.' });
    }

    // Create a record in the UserCourse model
    const userCourse = await UserCourse.create({
      userId: user.id,
      courseId: course.id,
      coursePrice: coursePrice,
      courseTitle: courseTitle,
      courseDescription: courseDescription,
      courseImage: courseImage
      // You can add additional fields here if needed
    });

    return res.status(200).json({ message: 'Course purchased successfully.', userCourse });
  } catch (error) {
    console.error('Error purchasing course:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
]

exports.getCheckoutById = [authenticateToken, async (req, res) => {
  const checkoutId = req.params.id;

  try {
    const checkout = await createusercheckout.findByPk(checkoutId);

    if (!checkout) {
      return res.status(404).json({ error: 'Checkout not found' });
    }

    return res.status(200).json(checkout);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}];
exports.getUserCoursesByUserId = [authenticateToken, async (req, res) => {
  const userId = req.params.id; // Assuming the user ID is passed as a route parameter

  try {
    // Check if the user with the given ID exists
    const registereduser = await users.findOne({ where: { id: userId } });
    // console.log('registereduser', registereduser)
    const user = await UserCourse.findByPk(userId);

    if (registereduser && !user) {
      // If user is not found, return a 404 error
      const userCourses = await UserCourse.findAll({
        where: { userId },

      });

      // res.status(200).json({ userCourses });
      return res.status(200).json({ userCourses, message: `You dont have any course's'` });
    } else if (!registereduser && !user) {

      return res.status(404).json({ error: 'no user found with the given id' });

    } else {

      // If user exists, fetch the associated courses
      const userCourses = await UserCourse.findAll({
        where: { userId },

      });
      res.status(200).json({ userCourses });
    }


  } catch (error) {
    console.error('Error fetching user courses:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
]

exports.createReferral = [authenticateToken, async (req, res) => {
  try {
    const { referrerId, refereeEmail, courseName, courseId, referrerName } = req.body;

    // Generate a unique referral code
    const referralCode = Math.random().toString(36).substring(7);

    // Create the referral in the database
    const referral = await Referral.create({
      referrerId, refereeEmail, courseName, courseId, referrerName,
      referralCode,
    });

    // Send the referral email
    const emailSent = await sendReferralEmail(refereeEmail, courseName, referrerName, referralCode);
    if (emailSent) {
      return res.status(200).json({ message: 'Referral invitation sent successfully!', data: referral });
    } else {
      // Handle case where email failed to send but database was created
      // For example, you might want to delete the created referral here
      await Referral.destroy({ where: { id: referral.id } });
      return res.status(500).json({ error: 'Failed to send referral email.' });
    }
  } catch (error) {
    console.error('Error creating referral:', error);
    res.status(500).json({ error: 'Error creating referral.' });
  }
}]


exports.universityList = async (req, res) => {
  const universities = [];
  fs.createReadStream('world-universities.csv')
    .pipe(csv())
    .on('data', (data) => {
      universities.push(data);
    })
    .on('end', () => {
      res.json(universities);
    });

}

exports.completeReferral = async (req, res) => {
  try {
    const { referralCode } = req.body;
    console.log('Received referralCode:', referralCode);
    console.log('req.bodyreq.body:', req.body);

    // Find the referral in the database
    const referral = await Referral.findOne({ where: { referralCode } });

    if (!referral) {
      return res.status(404).json({ error: 'Referral not found.' });
    }

    // Update the referral status to 'completed'
    await referral.update({ status: 'completed' });

    res.status(200).json({ referral });
  } catch (error) {
    console.error('Error completing referral:', error);
    res.status(500).json({ error: 'Error completing referral.' });
  }

 
};
// exports.getAllUsersCount = [authenticateToken, async (req, res) => {
//   try {
//     const usersCount = await user.countDocuments();
//     return res.status(200).json({ count: usersCount });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// }];


// exports.getUserCourses = [authenticateToken, async (req, res) => {
//   try {
//       const { userId } = req.params;

//       // Find the user with the specified userId and include course details
//       const user = await db.user.findByPk(userId, {
//           include: [
//               {
//                   model: db.createusercheckout,
//                   include: [
//                       {
//                           model: db.addCourse,
//                       },
//                   ],
//               },
//           ],
//       });

//       if (!user) {
//           return res.status(404).json({ message: 'User not found' });
//       }

//       // Extract the courses from the user object
//       const checkouts = user.createusercheckouts || [];

//       // Retrieve detailed information about each course
//       const coursesWithDetails = await Promise.all(
//           checkouts.map(async (checkout) => {
//               const detailedCourse = checkout.addCourse;
//               return {
//                   id: detailedCourse.id,
//                   courseTitle: detailedCourse.courseTitle,
//                   courseDescription: detailedCourse.courseDescription,
//                   coursePrice: detailedCourse.coursePrice,
//                   // Add more fields as needed
//               };
//           })
//       );

//       return res.status(200).json({ courses: coursesWithDetails });
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//   }
// }];






