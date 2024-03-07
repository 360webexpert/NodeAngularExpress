



module.exports = app => {
    
    const checkcontroller = require("../controllers/checkController")
    var router = require("express").Router();
    // Create a new user
    router.post("/signupEncrypt", checkcontroller.signupEncrypt);

    router.get("/getsignup/:id", checkcontroller.getsignupEncrypt);
    router.get("/getallsignup", checkcontroller.getallsignupEncrypt);
    

    
    app.use('/api', router);
  };
  
  
  
  