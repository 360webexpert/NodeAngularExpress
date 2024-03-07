

const db = require("../model");
const checkModel = db.check; 
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

exports.signupEncrypt = async (req, res) => {
    try {
      const { name, email, password } = req.body;
    console.log(req.body,"hhhhhh")
      // Generate a unique user ID using uuid
      const userId = uuidv4();
  
      const hashedUserId = await bcrypt.hash(userId, 10);
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = await checkModel.create({
        id: userId,
        name,
        email,
        password: hashedPassword,
      });
  
      res.status(200).json({
        message: 'User created successfully',
        user: {
          id: userId,
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          updatedAt: newUser.updatedAt,
          createdAt: newUser.createdAt,
        },
        success: true,
      });
    } catch (error) {
      console.error('Error creating user:', error);
  
      res.status(500).json({
        error: 'Error creating user',
        success: false,
      });
    }
  };




  exports.getsignupEncrypt = async (req, res) => {
    try {
      const idToFetch = req.params.id;
  
      // Check if the provided ID is numeric or UUID
      const isNumeric = !isNaN(idToFetch);
  
      let user;
  
      if (isNumeric) {
        // Fetch user by numeric ID
        user = await checkModel.findOne({ numericId: idToFetch });
      } else {
        // Fetch user by UUID
        user = await checkModel.findOne({ id: idToFetch });
      }
  
      if (!user) {
        res.status(404).json({
          error: 'User not found',
          success: false,
        });
        return;
      }
  
      res.status(200).json({
        user,
        success: true,
      });
    } catch (error) {
      console.error('Error fetching user:', error);
  
      res.status(500).json({
        error: 'Error fetching user',
        success: false,
      });
    }
  };
  

 
  

  exports.getallsignupEncrypt = async (req, res) => {
    try {
       
        const allUsers = await checkModel.findAll();
    
        
        const users = allUsers.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }));
    
        res.status(200).json({
          users,
          success: true,
        });
      } catch (error) {
        console.error('Error fetching users:', error);
    
        res.status(500).json({
          error: 'Error fetching users',
          success: false,
        });
      }
  };






