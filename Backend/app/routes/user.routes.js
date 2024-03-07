module.exports = app => {
  const user = require("../controllers/userController");
  var router = require("express").Router();
  // Create a new user
  router.post("/createuser", user.create);
  router.get("/user", user.getUserByToken);
  router.get("/user/:userId", user.getUserById);
  router.post("/updateuser/:id", user.update);
  router.post("/login", user.login);
  router.post("/forgot-password", user.forgotPassword);
  router.post("/reset-password", user.resetPassword);
  router.post("/usercheckout", user.createUserCheckout);
  router.get("/getTransactions", user.getAllCheckouts);
  router.post("/createusercourse", user.createUserCourse);
  router.get('/user-courses/:id', user.getUserCoursesByUserId);
  router.post('/createreferral', user.createReferral);
  router.post('/verifyreferral', user.completeReferral);
  router.get('/get-transactions/:id', user.getCheckoutById);
  router.get("/allusers", user.getUsers);
  router.delete('/delete/:id', user.deleteUser);
  router.get('/getalluniversities', user.universityList);
  app.use('/api', router);
};



