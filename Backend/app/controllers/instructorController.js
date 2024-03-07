const { sendPasswordByEmailInstructor } = require('../email/emailService');
const bcrypt = require('bcrypt');
const db = require("../model");
const instructorModel = db.instructor; 
function generateRandomPassword() {
    const length = 10;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset.charAt(randomIndex);
    }
    return password;
  }
  exports.createInstructor = async (req, res) => {
    try {
      const { name, email, address, country, state, city } = req.body;
      console.log(req.body, "kkkkkkkk");
  
      // Check if the instructor with the provided email already exists
      const existingInstructor = await instructorModel.findOne({ where: { email } });
  
      if (existingInstructor) {
        return res.status(400).json({ message: 'Instructor with this email already exists' });
      }
  
      // Generate a random password
      const password = generateRandomPassword();
  
      // Hash the password synchronously
      const hashedPassword = bcrypt.hashSync(password, 10);
  
      // Create an instructor record in the database with the default role 'instructor'
      const newInstructor = await instructorModel.create({
        name,
        email,
        address,
        country,
        state,
        city,
        zip: '5677',
        password: hashedPassword,
        role: 'instructor',
      });
  
      // Send the password to the instructor's email
      await sendPasswordByEmailInstructor(email, password);
  
      // Send a response with a JSON object containing the success message
      res.status(200).json({
        message: 'Instructor created successfully',
        instructor: newInstructor,
        success: true,
      });
    } catch (error) {
      console.error('Error creating instructor:', error);
  
      // Send a response with a JSON object containing the error message
      res.status(500).json({ error: 'Error creating Instructor', success: false });
    }
  };




exports.getAllInstructors = async (req, res) => {
    try {
        // Retrieve all instructors from the database
        const instructors = await instructorModel.findAll();

        res.status(200).json({ instructors });
    } catch (error) {
        console.error('Error getting all instructors:', error);
        res.status(500).send('Error getting all instructors.');
    }
};



exports.getInstructorById = async (req, res) => {
    try {
        const { id } = req.params;

        // Retrieve the instructor by ID from the database
        const instructor = await instructorModel.findByPk(id);

        if (!instructor) {
            return res.status(404).json({ message: 'Instructor not found' });
        }

        res.status(200).json({ instructor });
    } catch (error) {
        console.error('Error getting instructor by ID:', error);
        res.status(500).send('Error getting instructor by ID.');
    }
};





exports.editInstructorById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, address, country, state, city, zip } = req.body;

        // Find the instructor by ID
        const instructor = await instructorModel.findByPk(id);

        if (!instructor) {
            return res.status(404).json({ message: 'Instructor not found' });
        }

        // Update the instructor's information
        await instructor.update({
            name,
            email,
            address,
            country,
            state,
            city,
            zip,
        });

        res.status(200).json({ message: 'Instructor updated successfully' });
    } catch (error) {
        console.error('Error editing instructor by ID:', error);
        res.status(500).send('Error editing instructor by ID.');
    }
};

exports.deleteInstructorById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the instructor by ID
        const instructor = await instructorModel.findByPk(id);

        if (!instructor) {
            return res.status(404).json({ message: 'Instructor not found' });
        }

        // Delete the instructor
        await instructor.destroy();

        res.status(200).json({ message: 'Instructor deleted successfully' });
    } catch (error) {
        console.error('Error deleting instructor by ID:', error);
        res.status(500).send('Error deleting instructor by ID.');
    }


    
};




exports.signupInstructor = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      console.log(req.body, "kkkkkkkk");
  
      const existingInstructor = await instructorModel.findOne({ where: { email } });
  
      if (existingInstructor) {
        return res.status(400).json({ message: 'Instructor with this email already exists' });
      }
  
      const newInstructor = await instructorModel.create({
        name,
        email,
        password,
        zip: '5677',

      });
  
      res.status(200).json({
        message: 'Instructor created successfully',
        instructor: newInstructor,
        success: true
      });
    } catch (error) {
      console.error('Error creating instructor:', error);
      res.status(500).json({ error: 'Error creating instructor', success: false });
    }
  };
  



