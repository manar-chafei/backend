// backend/routes/userRoutes.js
const express = require("express");
const {
  register,
  login,
  getUserProfile,
  updateProfile,
  getUsersProfiles,
  updateUsersProfile,
  deleteUser,
  addUserProfile,
} = require("../controllers/UserController");
const { body, validationResult } = require("express-validator");
const { authenticate, authn, authrec } = require("../middleware/auth"); // Middleware d'authentification

const router = express.Router();

// Route pour l'enregistrement
router.post(
  "/register",
  [
    body("name").not().isEmpty().withMessage("Le nom est requis"),
    body("email").isEmail().withMessage("Veuillez entrer un email valide"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Le mot de passe doit contenir au moins 6 caractères"),
    body("role")
      .optional()
      .isIn(["candidate", "recruiter", "admin"])
      .withMessage("Rôle invalide"),
  ],
  (req, res, next) => {
    // Vérification des erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  register
);

// Route pour la connexion
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Veuillez entrer un email valide"),
    body("password").not().isEmpty().withMessage("Le mot de passe est requis"),
  ],
  (req, res, next) => {
    // Vérification des erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  login
);

// Routes pour l'utilisateur connecté (authentifié avec `authn`)
router.get("/profile", authn, getUserProfile);
router.put("/profile", authn, updateProfile);

// Routes pour les administrateurs (authentifié avec `authenticate`)
router.get("/profiles", authenticate, getUsersProfiles);
router.put("/profiles/:id", authenticate, updateUsersProfile);
router.delete("/profiles/:id", authenticate, deleteUser);
router.post("/profiles", authenticate, addUserProfile);

module.exports = router;
