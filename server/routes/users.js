// // var express = require('express');
// // var router = express.Router();
// // const mongoose = require('mongoose');
// // const app = express();
// const express = require('express');
// const router = express.Router();
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// const app = express();


// const MONGODB_URI = 'mongodb://localhost:27017/sample'; // Make sure to replace with your actual MongoDB URI
// mongoose.connect(MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
//   .then(() => {
//     console.log('MongoDB database connection established successfully');
//   })
//   .catch((error) => {
//     console.error('MongoDB connection error: ', error);
//   });

// // Create a User schema
// const userSchema = new mongoose.Schema({
//   firstName: {
//     type: String,
//     required: true
//   },
//   lastName: {
//     type: String,
//     required: true
//   },

//   email: {
//     type: String,
//     required: true
//   },
//   password: {
//     type: String,
//     required: true
//   }
// });

// // Create a User model
// const User = mongoose.model('User', userSchema);
// /* GET users listing. */

// // router.get('/', function(req, res) {
// //   res.send('respond with a resource');
// // });

// router.post('/register', async function(req, res) {
//   res.send("test")
//  console.log(req.body);
//   try {
//     const { firstName, email, password } = req.body;

//     const newUser = new User({
//       firstName,
//         email,
//       password,
//     });
// console.log(newUser)

//     await newUser.save();

//     res.status(201).json({ message: 'User registered successfully' ,_id});
//   } catch (error) {
//     res.status(400).json({ message: 'Registration failed', error: error.message });
//   }

//   res.send('respond with a wfdwqef resource');
// });
// router.post('/test', async function(req, res) {
//   res.send("test")
//  // console.log(re);
// })

// // router.post('/register', async function(req, res) {
// //   console.log(req.body);
// // })
// // //   try {
// // //     const { firstName, lastName, email, password } = req.body;

// // //   //   const newUser = new User({
// // //   //     firstName,
// // //   //     lastName,
// // //   //     email,
// // //   //     password,
// // //   //   });

// // //   //   const savedUser = await newUser.save();

// // //   //   // Retrieve the _id of the saved user
// // //   //   const { _id } = savedUser;

// // //   //   res.status(201).json({ message: 'User registered successfully', userId: _id });
// // //   // } catch (error) {
// // //   //   res.status(400).json({ message: 'Registration failed', error: error.message });
// // //   // }
// // // });


// // // app.post('/register', async (req, res) => {
// // //   // const { username, email, password } = req.body;
// // //   // console.log("data", username);
// // //   // try {
// // //   //   const user = new User({ username, email, password });
// // //   //   await user.save();
// // //   //   res.status(201).json({ message: 'User registered successfully' });
// // //   // } catch (error) {
// // //   //   console.error('Error saving user to the database: ', error); // Log the error
// // //   //   res.status(500).json({ error: 'Internal Server Error' });
// // //   // }
// // //   res.send('respond with a dsegfesgrgre resource');
// // // });



// router.post("/login",(req,res) => {

//   //Form Valdiation



// const email = req.body.email;
// const password = req.body.password;

// //Find user by Email
// User.findOne({email}).then(user=>{
//     if(!user){
//         return res.status(404).json({ emailnotfound: "Email not found" });
//     }




// // //   });
// // // });

// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find user by Email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ emailnotfound: "Email not found" });
//     }

//     // Check password
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(400).json({ passwordincorrect: "Password incorrect" });
//     }

//     // You can generate and send a token for authentication if the email and password are correct
//     res.json({ success: true, message: "Login successful" });
//   } catch (error) {
//     res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// });


// module.exports = router;


const express = require('express');
const router = express.Router();
const userController = require('../controller/userController')

router.get("/", userController.get );
router.post("/register", userController.post);
router.get("/fetchuser", userController.fetchuser);
router.put("/update/:id", userController.updateById);
router.post("/login", userController.login);
router.get("/getSingle", userController.getSingle)
router.get("/fetchuser/:id", userController.fetchuserById );
router.delete("/deleteuser/:id", userController.deleteuserById);
router.post("/forgetPassword" , userController.forgetPassword)
router.post("/create", userController.createUser)
router.post("/verifyOtp", userController.verifyOtp)
router.post("/setNewPassword", userController.setNewPassword)
router.post("/forgetpasswordverifyOtp", userController.forgetPasswordverifyOtp)
router.post("/loginverifyOtp", userController.loginverifyOtp)
router.post("/handleTwoFactorAuthentication", userController.handleTwoFactorAuthentication)
router.post("/verifyTwoFactorAuthentication", userController.verifyTwoFactorAuthentication)
router.post("/getTwoFactorAuthentication", userController.getTwoFactorAuthentication)
router.post("/disableTwoFactorAuthentication", userController.disableTwoFactorAuthentication)
// router.post("/submitkyc", userController.handlekyc)

module.exports = router;




// router.get("/fetchuser/:id",  function (req, res, next) {
//   try {
//     const ID = req.params.id;
//     User.findOne({ _id: ID })
//       .then((data) => res.json({ data }))
//       .catch((err) => res.json(err))
//   } catch (error) {
//     console.log(error);
//   }
// });



// try {
    //   const token = req.header('Authorization');
    //   if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });
    //   const tokenData = token.split(' ')[1]; // Extracting the token from the Bearer token
    //   jwt.verify(tokenData, 'aaraa', (err, decoded) => {
    //     if (err) return res.status(401).json({ message: 'Invalid token.' });
    //     console.log(decoded)
    //     const ID = decoded.data;
    //     User.findOne({ _id: ID })
    //       .then((data) => res.json({ data }))
    //       .catch((err) => res.status(404).json({ message: 'User not found' }));
    //   });
      
    // } catch (error) {
    //   console.error('Error:', error);
    //   res.status(500).json({ message: 'Server Error' });
    // }
// <--------------------------------------------------------------->
// router.delete("/deleteuser/:id", function (req, res, next) {
//   try {
//     const ID = req.params.id;
//     User.deleteOne({ _id: ID })
//       .then((data) => res.json({ data }))
//       .catch((err) => res.json(err));
//   } catch (error) {
//     console.log(error);
//   }
// // });

// router.delete("/deleteuser/:id", function (req, res, next) {
//   console.log(req.params.id);
//   try {
//     const token = req.header('Authorization');
//     if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

//     const tokenData = token.split(' ')[1]; // Extracting the token from the Bearer token

//     jwt.verify(tokenData, 'aaraa', (err, decoded) => {
//       if (err) return res.status(401).json({ message: 'Invalid token.' });
//       console.log(decoded);
//       const ID = decoded.data;
//       User.findOneAndDelete({ _id: ID })
//         .then((data) => res.json({ message: 'User deleted successfully' }))
//         .catch((err) => res.status(404).json({ message: 'User not found' }));
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });



//<------------------------------------------------------------->
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ emailnotfound: "Email not found" });
//     }

//     else if (password !== user.password) {
//       return res.status(400).json({ passwordincorrect: "Password incorrect" });
//     }

//     res.json({ success: true, message: "Login successful", user });
//   } catch (error) {
//     res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }


// router.post('/upload', userController.post);
//------------------------------->

// async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   console.log(user);
//   if (!user) {
//     res.status(401).
//     json({ message: 'Invalid email or password' });
//   }
//   const passwordCheck = await bcrypt.compare(password, user.password);
//   console.log(passwordCheck);
//   if (!passwordCheck) {
//     return res.status(401).
//     json({ message: 'Invalid email or password' });;
//   }
// const token=  jwt.sign({
//     data:user. _id
//   }, 'aaraa', { expiresIn: '1hr' });
//   res.status(200).json({message: 'Login successfully..',user, token})
// }

//<-------------------------->
// router.put("/update/:id", async (req, res) => {
//   // try {
//   //   const { firstName, email, _id} = req.body;
//   // const res = await User.updateOne({_id: _id}, {
//   //     firstName: firstName,
//   //     email: email,
//   //     // password: password, 
//   //   })
    
//   // } catch (error) {
//   //   res
//   //   .status(400)
//   //   .json({ message: "request Failed", error: error.message });
//   // }
//   console.log(req.body)
//   try {
//     const { firstName, email } = req.body; // Remove _id as it's already in the route params
//     const userId = req.params.id; // Get the user ID from route params
//     const updatedUser = await User.updateOne({ _id: userId }, {
//               firstName: firstName,
//               email: email,    
//             });
//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.json({ message: "User updated successfully", user: updatedUser });
//   } catch (error) {
//     res.status(400).json({ message: "Request Failed", error: error.message });
//   }
// });






// router.put("/updateuser/:id", async (req, res) => {
//   try {
//     const token = req.header('Authorization');
//     if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });
//     const tokenData = token.split(' ')[1]; 
//     try {
//       const decoded = jwt.verify(tokenData, 'aaraa', (err, decoded)); 
//       const { firstName, email, _id } = req.body;
//       const result = await User.updateOne({ _id: _id }, {
//         firstName: firstName,
//         email: email,    
//       });
//       if (!result) {
//         return res.status(404).json({ message: 'User not found' });
//       }
//       res.json({ message: 'User updated successfully' });
//     } catch (error) {
//       res.status(401).json({ message: 'Invalid token.' });
//     }
//   } catch (error) {
//     res.status(400).json({ message: 'Request Failed', error: error.message });
//   }
// });



