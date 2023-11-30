const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
    password: {
    type: String,
    required: true
  },
  otp: {
    code: {
        type: String,
        required: true,
    },
    expiration: {
        type: Date,
        required: true,
    },
},
createdAt: {
    type: Date,
    default: Date.now(),
},
updatedAt: {
    type: Date,
},
verified: {
    type: Boolean,
    default: false,
},
temp_secret: {
  type: Object
},
secret: {
  type: Object,
},
twoFactorAuth: {
  type: Boolean,
  default: false
},
kycstatus:{
  type:Boolean,
  default:false
},
frontSideImg:{
  type:String
},
backSideImg:{
  type:String
},
kycSelfieImg:{
  type:String
},
createdAt:{
  type:Date,
  default:Date.now()
},

 
},
 {collection: 'users'});

const User = mongoose.model('User', userSchema);
module.exports = User;