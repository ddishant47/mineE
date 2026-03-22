const express = require("express");
const router = express.Router();

// Simple static admin login for demonstration
// In a real app, use bcrypt and a User model
const ADMIN_USER = {
    username: "admin",
    password: "password123"
};

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
            // Success: Return a simple token (In production use JWT)
            res.json({
                success: true,
                token: "admin-secret-token",
                user: { username: "admin", role: "admin" }
            });
        } else {
            res.status(401).json({ success: false, message: "Invalid username or password" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
