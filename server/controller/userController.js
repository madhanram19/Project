const bcrypt = require('bcrypt');
const User = require('../model/schema')
var jwt = require('jsonwebtoken');
const { upload } = require('../mutar/multar')
const path = require('path')
const { verifyToken } = require('../middleware/verifyToken')
const speakEasy = require('@levminer/speakeasy')
// require('dotenv').config()
const qrCode = require('qrcode')



exports.get = (req, res, next) => {
    try {
        User.find({})
            .then((data) => res.json({ data }))
            .catch((err) => res.json(err));
        // res.send({msg:"asdfasdf"})
    } catch (error) {
        console.log(error);
    }
}


// exports.post = async (req, res) => {
//     console.log(req.body);
//     try {
//         // console.log(req.body);
//         const { firstName, lastName, email, username, password } = req.body;
//         // Hashing the password
//         // const hashedPassword = await bcrypt.hash(password, 10);
//         // Note: Do not compare the password immediately after hashing
//         // const isPasswordMatch = bcrypt.compareSync('user_password', hashedPassword);
//         const newUser = new User({
//             firstName,
//             lastName,
//             email,
//             username,
//             password // Save the hashed password to the database
//         });
//         await newUser.save();
//         res.status(201).json({ message: "User registered successfully" });
//     } catch (error) {
//         console.error(error);
//         res.status(400).json({ message: "Registration failed", error: error.message });
//     }
// };

exports.post = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: "Image upload failed", error: err });
        }
        try {
            console.log(req.body);
            const { firstName, lastName, username, email, password, profileImage } = req.body;
            const encrptPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                firstName,
                lastName,
                email,
                username,
                password: encrptPassword,
                profileImage: path.join("uploads/", req.file.filename)
            });
            await newUser.save();
            res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
            res.status(400).json({ message: "Registration failed", error: error.message });
        }
    });
};


exports.fetchuser = (req, res, next) => {
    try {
        User.find({})
            .then((data) => res.json({ data }))
            .catch((err) => res.json(err));
    } catch (error) {
        console.log(error);
    }
}

exports.getsingleuserById = (req, res, next) => {
    console.log(req.params.id);
    const userid = req.params.id;
    try {
        User.findOne({ _id: userid })
            .then((data) => res.json({ data }))
            .catch((err) => res.json(err));
    } catch (error) {
        console.log(error);
    }
}

exports.forgetPassword = async (req, res) => {
    console.log(req.body);
    try {
        const { email } = req.body
        const getUserData = await User.findOne({ email })
        if (!getUserData) {
            return res.status(401).json({ message: 'User Not Found' })
        }
        const generateOTP = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        await User.updateOne({ email }, { $set: { 'otp.code': generateOTP } })
        const updateOtpData = await User.findOne({ email })
        res.status(200).json(updateOtpData)
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' })
    }

}

exports.createUser = async (req, res) => {
    const exiting = await User.findOne({ email: req.body.email })
    if (exiting) {
        return res.status(409).json({ message: "Already User Exiting" })
    }
    try {
        const { firstName, lastName, username, email, password } = req.body
        const generateOTP = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        const hashPassword = await bcrypt.hash(password, 10)
        const createUser = {
            firstName,
            lastName,
            username,
            email,
            password: hashPassword,
            otp: {
                code: generateOTP.toString(),
                //10mintunes Validate
                expiration: new Date(Date.now() + 10 * 60 * 1000),
                verified: false,
            },
        }
        User.create(createUser)
            .then((data) => res.status(201).json({ message: "Register SuccessFully", data }))
            .catch(() => res.status(404).json({ message: "Some Went Wrong" }))
    } catch (err) {
        res.status(500).json({ message: 'Internal Error' })
    }
}



exports.login = async (req, res) => {
    console.log(req.body);
    try {
        const { username, password } = req.body;
        const users = await User.findOne({ username: username });
        console.log(users)
        const passwordCheck = await bcrypt.compare(password, users.password);
        if (!passwordCheck) {
            return res.status(400).json({ message: "Login failed, incorrect password" });
        }
        const generateOTP = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        await User.updateOne({ username }, { $set: { 'otp.code': generateOTP } })
        const updateOtpData = await User.findOne({ username })
        console.log(updateOtpData);
        // // If email and password are valid, create and send a JSON Web Token (JWT)
        // const token = jwt.sign({ _id: users._id }, 'xfgfghfhdsfsdfsfd', { expiresIn: "1hr" });
        res.status(200).json({ updateOtpData });
    } catch (error) {
        console.error("Login failed", error);
        res.status(500).json({ message: "Server error" });
    }
}

exports.loginverifyOtp = async (req, res) => {
    try {
        const { otp, id } = req.body
        const loginData = await User.findOne({ _id: id })
        // If email and password are valid, create and send a JSON Web Token (JWT)
        const token = jwt.sign({ _id: loginData._id }, 'aaraa', { expiresIn: "1hr" });
        if (!(otp === loginData.otp.code)) {
            return res.status(404).json({ message: 'Your OTP Wrong' })
        } else {
            return res.status(200).json({ message: 'OTP Verified', token })
        }
    } catch (err) {
        res.status(500).json({ message: "Internal Error" })
    }
}

exports.handleTwoFactorAuthentication = async (req, res) => {
    try {
        const { id } = req.body
        const secretCode = speakEasy.generateSecret()
        await User.updateOne({ _id: id }, { $set: { temp_secret: secretCode } })
        const twoFactorAuthData = await User.findOne({ _id: id })
        res.status(200).json({ message: 'Generate TwoFactorAuth', twoFactorAuthData })

    } catch (error) {
        res.status(500).json({ message: 'Something Went Wrong' })
    }
}

exports.verifyTwoFactorAuthentication = async (req, res) => {
    try {
        const { id, token } = req.body
        const getUser = await User.findOne({ _id: id })
        const { base32: secret } = getUser.temp_secret
        // res.status(200).json({ message: 'Generate TwoFactorAuth', secretCode })
        let tokenValidates = speakEasy.totp.verify({
            secret,
            encoding: "base32",
            token,
        })

        if (!tokenValidates) {
            return res.status(404).json({ message: 'Authentication Invalid' })
        }

        let qrCodeVerify = speakEasy.totp.verify({
            secret: getUser.temp_secret.ascii,
            encoding: 'ascii',
            token
        })
        if (!qrCodeVerify) {
            return res.status(401).json({ message: 'Authentication Invalid' })
        }
        const jwtToken = jwt.sign(
            { id: getUser._id },
            // process.env.ACCESS_TOKEN_SECERT,
            'aaraa',
            { expiresIn: '1h' }
        )
        await User.updateOne({ _id: id }, { $set: { temp_secret: null, secret: getUser.temp_secret, twoFactorAuth: true } })
        const updateUser = await User.findOne({ _id: id })
        res.status(200).json({ message: 'Authentication Verified', twoFactorAuth: updateUser.twoFactorAuth, token: jwtToken })

    } catch (error) {
        res.status(500).json({ message: 'Error Generating Authencation ' })
    }
}

exports.getTwoFactorAuthentication = async (req, res) => {
    try {
        const { id } = req.body
        const secretCode = speakEasy.generateSecret()
        await User.updateOne({ _id: id }, { $set: { temp_secret: secretCode } })
        const twoFactorAuthData = await User.findOne({ _id: id })

        // generating QrCode Img Src
        qrCode.toDataURL(twoFactorAuthData.temp_secret.otpauth_url, function (err, data) {
            if (err) {
                return res.status(404).json({ message: 'Generating QrCode Error' })
            }
            res.status(200).json({ message: 'Generate TwoFactorAuth', twoFactorAuthData, qrCodeImgSrc: data })
        })

    } catch (error) {
        res.status(500).json({ message: 'Something Went Wrong' })
    }
}

exports.disableTwoFactorAuthentication = async (req, res) => {
    try {
        const { id } = req.body
        await User.updateOne({ _id: id }, { $set: { secret: null, twoFactorAuth: false } })
        res.status(200).json({ message: 'Disabled Your Authetication' })

    } catch (error) {
        res.status(500).json({ message: 'Error Disable Your Authentication' })
    }
}


exports.verifyOtp = async (req, res) => {
    console.log(req.body);
    try {
        const { otp, id } = req.body
        let userData = await User.findOne({ _id: id })
        if (!(otp === userData.otp.code)) {
            res.status(404).json({ message: 'Your OTP Wrong' })
            return
        } else {
            res.status(200).json({ message: 'OTP Verified' })
        }
    } catch (err) {
        res.status(500).json({ message: "Internal Error" })
    }
}

exports.setNewPassword = async (req, res) => {
    console.log(req.body);
    try {
        const { password, id } = req.body
        const hashPassword = await bcrypt.hash(password, 10)
        await User.updateOne({ _id: id }, { $set: { password: hashPassword } })
        res.status(200).json({ message: 'Password Updated' })
    } catch (err) {
        res.status(500).json({ message: "Internal Error" })
    }
}

exports.fetchuserById = (req, res) => {
    console.log(req.params.id);
    const userid = req.params.id;
    try {
        User.findOne({ _id: userid })
            .then((data) => res.json({ data }))
            .catch((err) => res.json(err));
    } catch (error) {
        console.log(error);
    }
}

exports.handlekyc = (req, res, next) => {
  
    upload.fields([
       { name: 'frontSideImg' },
       { name: 'backSideImg' },
       { name: 'kycSelfieImg' },
    ])  (req, res, (err) => {
       if (err) {
       return res.status(400).json({ error: err.message });
       }
         
         // console.log(req.files);//check file receieve
         // console.log(req.body.id)
 
      
         const id=req.body.id
         const userexists = User.findOne({ _id:id
         })
         if(!userexists){
           return res.status(401).json({ message:'image unsucessfully'});
         }else{
 
         const frontSideImg=req.files.frontSideImg[0].path
         const backSideImg=req.files.backSideImg[0].path
         const kycSelfieImg=req.files.kycSelfieImg[0].path
         // console.log(backSideImg,typeof(backSideImg));
 
           User.updateOne({ _id:id
           },{ $set:{ frontSideImg:frontSideImg,
             backSideImg:backSideImg, 
             kycSelfieImg:kycSelfieImg
           } }).then((data)=>res.status(200).json({message:'kyc upload sucessfully',data})).catch((err)=> res.status(404).json({message:'Error in kyc upload ',err}))
         
         }
 
    });
 };
 

//exports.login = async (req, res) => {
// const { username, password, otp} = req.body;
// const user = await User.findOne({ username});
// console.log(user);
//  try {
//     if (!user) {
//         res.status(401).
//         json({ message: 'User Not Found' });
//     }
//     const { username, _id } = req.body
//     const generateOTP = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
//     await User.updateOne({ username }, { $set: { 'otp.code': generateOTP } })
//     const updateOtpData = await User.findOne({ username, id:_id })
//      res.status(200).json(updateOtpData)
// const logInUser = {
//     username,
//     password: hashPassword,
//     otp: {
//         code: generateOTP.toString(),
//         // 5mintunes Validate
//         expiration: new Date(Date.now() + 5 * 60 * 1000),
//         verified: false,
//     },
// }
// User.create(logInUser)
//     .then((data) => res.status(201).json({ message: "Register SuccessFully", data }))
//     .catch(() => res.status(404).json({ message: "Some Went Wrong" }))
//         } catch (err) {
//             res.status(500).json({ message: 'Internal Error' })
//         }
//         const hashPassword = await bcrypt.hash(password, 10)
//         const passwordCheck = await bcrypt.compare(password, user.password);
//         console.log(passwordCheck);
//         if (!passwordCheck) {
//             return res.status(401).
//                 json({ message: 'Invalid email or password' });;
//         }
//         const token = jwt.sign({
//             data: user._id
//         }, 'aaraa', { expiresIn: '1hr' });
//         res.status(200).json({ message: 'Login successfully..', user, token })
//    // }
//     // console.log(req.body);
//     try {
//       const { email, password } = req.body;

//       const user = await User.findOne({ email: email });

//       const comparePwd = await bcrypt.compare(password, user.password);

//       if (!user) {
//         res.status(400).json({ message: "Login failed", error: error.message });
//       } else if (!comparePwd) {
//         res.status(400).json({ message: "Login failed", error: error.message });
//       } else {
//         // res.json({user});

//         //secret Key
//         const secretKey = process.env.SECRET_KEY;
//         console.log(secretKey);

//         const token = jwt.sign(
//           {
//             data: user._id,
//           },
//           secretKey,
//           { expiresIn: "1h" }
//         );
//           res.status(201).json({ token, user, message: "login Success" });
//       }
//     } catch (error) {
//       res.status(400).json({ message: "Login failed", error: error.message });
//     }
//   };


exports.deleteuserById = (req, res, next) => {
    console.log(req.params.id);
    try {
        User.findOneAndDelete({ _id: req.params.id })
            .then((data) => res.json({ message: 'User deleted successfully' }))
            .catch((err) => res.status(404).json({ message: 'User not found' }));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
}

exports.updateById = async (req, res) => {
    // console.log(req.body)
    try {
        const { firstName, email } = req.body.data; // Remove _id as it's already in the route params
        const userId = req.params.id; // Get the user ID from route params
        const updatedUser = await User.findByIdAndUpdate(userId, {
            firstName: firstName,
            email: email,
        }, { new: true }); // Add { new: true } option to return the updated document

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        res.status(400).json({ message: "Request Failed", error: error.message });
    }
}

exports.getSingle = async (req, res) => {
    try {
        const token = req.headers.authorization;
        console.log(token);
        const tokenVerification = verifyToken(token);
        if (tokenVerification.error) {
            return res.status(401).json({ message: tokenVerification.error });
        }
        const { decoded } = tokenVerification;
        const userID = decoded.data;
        // console.log(decoded);
        const foundUser = await User.findOne({ _id: userID });
        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ data: foundUser });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Error fetching user", error: error.message });
    }
};

exports.forgetPasswordverifyOtp = async (req, res) => {
    try {
        const { otp, id } = req.body
        const userData = await User.findOne({ _id: id })
        if (!(otp === userData.otp.code)) {
            return res.status(404).json({ message: 'Your OTP Wrong' })
        } else {
            res.status(200).json({ message: 'OTP Verified' })
        }
    } catch (err) {
        res.status(500).json({ message: "Internal Error" })
    }
}

