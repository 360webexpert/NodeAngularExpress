
const path = require('path'); // Add this line
const config = require('../../config')
module.exports = app => {
  const course = require("../controllers/Admin/adminCourse.controller");
  const multer = require('multer');
  const fs = require('fs');
  var router = require("express").Router();
  // Set up multer for handling file uploads
  // const storage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, 'app/uploads');
  //   },
  //   filename: function (req, file, cb) {
  //     cb(null, Date.now() + path.extname(file.originalname));
  //   },
  // });
  // const upload = multer({ storage: storage });

  // Set up storage for uploaded files
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = './uploads/';
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath);
//     }
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
//   fileFilter: (req, file, cb) => {
//     const allowedFileTypes = /jpeg|jpg|png|pdf|txt/; // Allow only these file types
//     const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = allowedFileTypes.test(file.mimetype);
//     if (extname && mimetype) {
//       return cb(null, true);
//     } else {
//       cb(new Error('Invalid file type. Only JPEG, JPG, PNG, PDF, and TXT files are allowed.'));
//     }
//   },
// });
// // Endpoint to upload a file
// router.post('/upload', upload.single('file'), (req, res, next) => {
  
//   if(res.statusCode == 200){
// console.log('req.file', req.file)
//     return res.status(201).send({message:'File uploaded successfully!',fileUrl: req.file.path});
//   }else{
//     return res.status(400).send('Failed to upload File ');

//   }
// });

// router.get('/file/:filename', (req, res) => {
//   const uploadPath = './uploads/';
//   const filename = req.params.filename;
//   const filePath = path.join(uploadPath, filename);
  
//   fs.stat(filePath, (err, stats) => {
//     if (err) {
//       return res.status(404).send('File not found.');
//     }
    
//     // Construct the URL based on the filename
//     const fileUrl = `http://${req.headers.host}/api/files/${filename}`;
    
//     res.json({ filename, fileUrl, uploadDate: stats.birthtime });
//   });
// });

// Configure Multer for handling file uploads

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Set up multer with fileFilter for image types
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png/; // Allow only these file types
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, JPG, and PNG files are allowed.'));
    }
  },
});

// Endpoint to upload a file
router.post('/upload', upload.single('file'), (req, res, next) => {
  if (res.statusCode == 200) {
    console.log('File uploaded successfully:', req.file);
    // Construct the URL based on the filename
    const fileUrl = req.file?.filename;
    // Send the file URL in the response along with a success message
    return res.status(201).send({ message: 'File uploaded successfully!', fileUrl });
  } else {
    return res.status(400).send('Failed to upload File ');
  }
});

// Endpoint to get a file by its filename
router.get('/file/:filename', (req, res) => {
  const uploadPath = path.resolve('./uploads/'); // Resolve the absolute path
  const filename = req.params.filename;
  const filePath = path.join(uploadPath, filename);
  
  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('File not found.');
    }
    // Send the file as response
    
    res.sendFile(filePath);
  });
});
  // Create a new user
  router.post("/createcourse", upload.single('courseImage'), course.createCourse);
  router.get("/getcoursedetails/:id",  course.getCoursebyid);
  router.get("/getallcourses",  course.getAllCourses);
  router.put('/updatecourses/:id', course.updateCourse);
  router.delete('/delete/:id', course.deleteCourse);
  router.get("/assignCourse",  course.getAssignCourses);
  
  app.use('/api', router);
};