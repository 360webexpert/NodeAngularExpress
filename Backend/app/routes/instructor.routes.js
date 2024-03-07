module.exports = app => {
    
    const instructor = require("../controllers/instructorController")
    var router = require("express").Router();
    // Create a new user
    router.post("/createinstructor", instructor.createInstructor);
    router.get('/getallinstructors', instructor.getAllInstructors);
    router.get('/getsingleinstructors/:id', instructor.getInstructorById);
    router.put('/updateinstructors/:id', instructor.editInstructorById);
    router.delete('/deleteinstructors/:id', instructor.deleteInstructorById);
    router.post("/signupInstructor", instructor.signupInstructor);


    
    app.use('/api', router);
  };
  
  
  
  