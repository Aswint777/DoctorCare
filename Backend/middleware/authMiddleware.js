const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  console.log('check user !');
  
  const token = req.cookies.token;
  console.log(token);
  

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;
    console.log(req.user,'uu');
    

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports = verifyToken;