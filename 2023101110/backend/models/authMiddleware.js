const jwt = require("jsonwebtoken");
const SECRET_KEY = "28140506";

const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; 

    console.log(token)
    if (!token) {
        return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }
    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified; 
        next();
    } catch (err) {
        res.status(403).json({ message: "Invalid Token" });
    }
};

module.exports = authenticateToken;
