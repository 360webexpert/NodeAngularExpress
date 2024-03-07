// const db = require("../../model");
// const Course = db.addCourse;

// // Controller to handle course creation
// async function createCourse(req, res) {
//   try {
//     const { courseTitle, courseDescription, coursePrice } = req.body;
//     const courseImage = req.file ? req.file.path : null;
   
//     // Check if required fields are present in the request body
//     if (!courseTitle || !courseDescription || !coursePrice) {
//       return res.status(400).json({ message: 'Course title, description, and price are required' });
//     }

//     // Check if a course with the same title already exists
//     const existingCourse = await Course?.findOne({ where: { courseTitle } });

//     if (existingCourse) {
//       return res.status(403).json({ message: 'Course already registered, try with a different one' });
//     }

//     // Create a new course in the database
//     const newCourse = await Course?.create({
//       courseTitle,
//       courseDescription,
//       coursePrice,
//       courseImage,
//     });
//     console.log("newCourse", newCourse)
//     if (newCourse) {
     
//       return res.json({ message: 'Course created successfully', course: newCourse });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }


// async function getAllCourses(req, res) {

//   Course?.findAll()
//     .then(data => {
//       if (data) {
//         res.send(data);
//       } else {
//         res.status(404).send({
//           message: 'No courses found',
//         });
//       }
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: 'Error retrieving courses',
//       });
//     })

// }
// async function getCoursebyid(req, res) {

//   const id = req.params.id;

//   Course.findOne({
//     where: {
//       id: id,
//     },
//   })
//     .then(data => {
//       if (data) {
//         res.send(data);
//       } else {
//         res.status(404).send({
//           message: 'Cannot find course',
//         });
//       }
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: 'Error retrieving user with id=' + id,
//       });
//     });
// }

// module.exports = {
//   createCourse,
//   getCoursebyid,
//   getAllCourses
// };
const db = require("../../model");
const authenticateToken = require("../authController");
const Course = db.addCourse;
// Controller to handle course creation
async function createCourse(req, res) {
  
    try {
      const { courseTitle, courseDescription, coursePrice ,courseImage,assignInstructor} = req.body;
      
      const existingCourse = await Course.findOne({ where: { courseTitle } });
      if (existingCourse) {
        return res.status(403).send({ message: "Course already registered, try with a different one" });
      }
      // Create a new course in the database
      const newCourse = await Course.create({
        courseTitle,
        courseDescription,
        coursePrice,
        courseImage,
        assignInstructor
      });
      return res.json({ message: 'Course created successfully', course: newCourse });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  
  async function updateCourse(req, res) {
    try {
      const { id } = req.params; // Assuming the course ID is passed in the URL params
      const { courseTitle, courseDescription, coursePrice, courseImage } = req.body;
      // Check if the course with the given ID exists
      const existingCourse = await Course.findByPk(id);
      if (!existingCourse) {
        return res.status(404).json({ message: 'Course not found' });
      }
      // Update the course details
      await existingCourse.update({
        courseTitle,
        courseDescription,
        coursePrice,
        courseImage,
      });
      // Fetch the updated course details
      const updatedCourse = await Course.findByPk(id);
      return res.json({ message: 'Course updated successfully', course: updatedCourse });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  async function deleteCourse(req, res) {
    try {
      const { id } = req.params; // Assuming the course ID is passed in the URL params
      // Check if the course with the given ID exists
      const existingCourse = await Course.findByPk(id);
      if (!existingCourse) {
        return res.status(404).json({ message: 'Course not found' });
      }
      // Delete the course
      await existingCourse.destroy();
      return res.json({ message: 'Course deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
async function getAllCourses  (req, res)  {
      Course.findAll()
        .then(data => {
          if (data) {
            res.send(data);
          } else {
            res.status(404).send({
              message: 'No courses found',
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: 'Error retrieving courses',
          });
        })
    }

  async function getCoursebyid  (req, res)  {
      const id = req.params.id;
      Course.findOne({
        where: {
          id: id,
        },
      })
        .then(data => {
          if (data) {
            res.send(data);
          } else {
            res.status(404).send({
              message: 'Cannot find course',
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: 'Error retrieving user with id=' + id,
          });
        });
    }


const getAssignCourses = [authenticateToken, async (req, res) => {
  const userId = req.userId; 

  try {
  
    const courses = await Course.findAll({'assignInstructor.id': userId});

  
    res.json({ courses });
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}];
    
module.exports = {
  createCourse,
  getCoursebyid,
  getAllCourses,
  updateCourse,
  deleteCourse,
  getAssignCourses
};