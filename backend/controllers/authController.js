const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require('../models/User')
const router = express.Router();

router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ msg: "User already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ email, password: hashedPassword });

        res.status(201).json({ msg: "User registered successfully!" });
    } catch (err) {
        console.error("Registration error:", err.message);
        res.status(500).json({ msg: "Server error during registration." });
    }
});


router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ msg: "User not found!" })
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ msg: "Wrong password!" })
    }

    const token = jwt.sign(
        { user: { id: user._id } },
        process.env.JWT_SECRET,
        { expiresIn: "30m" }
    );

    res.json({ token, msg: "Login successful!" });
})

module.exports = router;