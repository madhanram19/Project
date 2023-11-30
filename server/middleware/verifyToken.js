const jwt = require('jsonwebtoken');
require('dotenv').config(); 

const verifyToken = (token) => {
  try {
    if (!token || !token.startsWith('Bearer ')) {
      return { error: "Unauthorized: No token provided" };
    }
    const tokenValue = token.split(' ')[1];
    //secret Key
    const secretKey = 'aaraa'

    const decoded = jwt.verify(tokenValue, secretKey);

    return { decoded };
  } catch (error) {
    return { error: "Unauthorized: Invalid token" };
  }
};

module.exports = { verifyToken };