const { getAuth } = require("@clerk/express");

const requireAuthApi = (req, res, next) => {
    const auth = getAuth(req);

    if (!auth.isAuthenticated) {
        return res.status(401).json({ error: "Unauthorized", message: "Please sign in to continue" });
    }

    req.userId = auth.userId; // controller mein isse use karenge
    next();
};

module.exports = { requireAuthApi };