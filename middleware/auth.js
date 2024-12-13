// backend/middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware pour authentifier les utilisateurs normaux
exports.authn = async (req, res, next) => {
  const token =
    req.header("Authorization")?.replace("Bearer ", "") ||
    req.header("x-auth-token");

  if (!token) {
    return res
      .status(401)
      .json({ msg: "Pas d'authentification, accès refusé" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(404).json({ msg: "Utilisateur non trouvé" });
    }

    next(); // Passer au middleware suivant
  } catch (err) {
    console.error("Erreur de vérification du token:", err.message);
    res.status(401).json({ msg: "Token invalide, accès refusé" });
  }
};

// Middleware pour authentifier les recruteurs
exports.authrec = async (req, res, next) => {
  const token =
    req.header("Authorization")?.replace("Bearer ", "") ||
    req.header("x-auth-token");

  if (!token) {
    return res
      .status(401)
      .json({ msg: "Pas d'authentification, accès refusé" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(404).json({ msg: "Utilisateur non trouvé" });
    }

    if (req.user.role !== "recruiter") {
      return res
        .status(403)
        .json({ msg: "Accès refusé, vous n'avez pas les droits nécessaires" });
    }

    next(); // Passer au middleware suivant
  } catch (err) {
    console.error("Erreur de vérification du token:", err.message);
    res.status(401).json({ msg: "Token invalide, accès refusé" });
  }
};

// Middleware pour authentifier les administrateurs
exports.authenticate = async (req, res, next) => {
  const token =
    req.header("Authorization")?.replace("Bearer ", "") ||
    req.header("x-auth-token");

  if (!token) {
    return res
      .status(401)
      .json({ msg: "Pas d'authentification, accès refusé" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(404).json({ msg: "Utilisateur non trouvé" });
    }

    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ msg: "Accès refusé, vous n'avez pas les droits nécessaires" });
    }

    next(); // Passer au middleware suivant
  } catch (err) {
    console.error("Erreur de vérification du token:", err.message);
    res.status(401).json({ msg: "Token invalide, accès refusé" });
  }
};
