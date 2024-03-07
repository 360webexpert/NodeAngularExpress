const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./app/model");
const path = require("path");
const users = db.user;
const fs = require('fs');
const app = express();
const dotenv = require('dotenv');
const { FRONTEND_URL, BACKENDPORT,ADMIN_URL } = require("./config");
dotenv.config();
const sweetalert = require("sweetalert2")
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
    credentials: true, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };
app.use (cors(corsOptions));
//import ejs file
app.set('view engine', 'ejs')
app.set("views",path.join(__dirname, "views"));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});


// parse requests of content-type - application/json

app.use (bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded

app.use (bodyParser.urlencoded({extended:true}));

//simple route
app.get ("/", (req, res) => {
res.json({message: "Welcome"});
});


app.get("",(req,res)=>{
    res.render('emailtemplate')
})

db.sequelize.sync({ force: false }).then(async () => {
    console.log("Drop and re-sync db.");
  
    // Run migrations after syncing the database
    // await execMigrations();
  
    // // Start the server
    // app.listen(PORT, () => {
    //   console.log(`Server is running on port ${PORT}.`);
    // });
  });
  
  // async function execMigrations() {
  //   const { exec } = require('child_process');
  //   const util = require('util');
  //   const execAsync = util.promisify(exec);
  
  //   try {
  //     console.log('Running migrations...');
  //     await execAsync('npm run migrate');
  //     console.log('Migrations completed successfully.');
  //   } catch (error) {
  //     console.error('Error running migrations:', error);
  //     process.exit(1);
  //   }
  // }


app.get('/verify', (req, res) => {
        const verificationToken = req.query.token;
    
        users?.findOne({ where: { verificationToken: verificationToken } })
            .then((user) => {
                if (user) {
                    user.update({ isVerified: true, verificationToken: null })
                        .then(() => {
                            // res.send('Email verification successful');
                            return  res.redirect(`${FRONTEND_URL}/login`);
                            
                        })
                        .catch((err) => {
                            res.send('Error updating user status');
                        });
                } else {
                    
                    res.send('Invalid verification token');
                }
            })
            .catch((err) => {
                res.send('Error finding user');
            });
    });
    // app.get('/passwordverify', (req, res) => {
    //     const verificationToken = req.query.token;
    
    //     users?.findOne({ where: { verificationToken: verificationToken } })
    //         .then((user) => {
    //             console.log('user', user)
    //             if (user) {
    //                 // Update the user's status and remove verificationToken
    //                 user.update({ isVerified: true, verificationToken: null })
    //                     .then(() => {
    //                         // Generate a unique token for reset password
    //                         const resetPasswordToken = bcrypt.genSaltSync(10);
    //                         // Set an expiration time for the reset token (e.g., 1 hour)
    //                         const resetPasswordExpires = new Date();
    //                         resetPasswordExpires.setHours(resetPasswordExpires.getHours() + 1);
    
    //                         // Update the user's resetPasswordToken and resetPasswordExpires
    //                         user.update({
    //                             resetPasswordToken: bcrypt.hashSync(resetPasswordToken, 10),
    //                             resetPasswordExpires: resetPasswordExpires
    //                         })
    //                             .then(() => {
    //                                 // Redirect to the reset password page with the generated reset token
    //                                 return res.redirect(`${FRONTEND_URL}/reset-password?token=${resetPasswordToken}`);
    //                             })
    //                             .catch((err) => {
    //                                 res.status(500).send('Error updating reset password information.');
    //                             });
    //                     })
    //                     .catch((err) => {
    //                         res.status(500).send('Error updating user status.');
    //                     });
    //             } else {
    //                 res.status(400).send('Invalid verification token.');
    //             }
    //         })
    //         .catch((err) => {
    //             res.status(500).send('Error finding user.');
    //         });
    // });

    app.use(express.urlencoded({ extended: true }));

require("./app/routes/user.routes")(app);
require("./app/routes/admin.routes")(app);
require("./app/routes/instructor.routes")(app);
require("./app/routes/check.routes")(app)


// set port, listen for requests

const PORT = BACKENDPORT || 8080;
app.listen(PORT, () => {
console.log ('Server is running on port `$(PORT)`.');
});