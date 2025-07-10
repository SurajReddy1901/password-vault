const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
        return res.status(401).json({ msg: "No token, access denied!" });
    }

    const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    }
    catch {
        res.status(401).json({ msg: "Invalid token!" })
    }
};