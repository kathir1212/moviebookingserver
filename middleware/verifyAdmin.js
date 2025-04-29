const jwt = require("jsonwebtoken");
const MovieUser = require("../models/movieusers");

const verifyAdmin = async (req, res, next) => {
  console.log(req.headers,"req.headers.authorization");
  
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token,"token");
  

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded,"decoded");
    
    const user = await MovieUser.findById(decoded.id);

    console.log(user,"user>>>>>");
    

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = verifyAdmin;
