// controllers/UserController.js
const User = require("../models/User");

const bcrypt = require("bcryptjs"); // Pour le hachage des mots de passe
const { validationResult } = require("express-validator"); // Pour la validation des entrées

const jwt = require("jsonwebtoken"); // Pour générer un token JWT

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "Cet email est déjà utilisé" });
    }

    user = new User({ name, email, password, role });

    // Hachage du mot de passe
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    console.error("Erreur d'enregistrement:", err.message);
    res.status(500).json({ msg: "Erreur serveur" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Identifiants invalides" });
    }

    // Vérification du mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Identifiants invalides" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    console.error("Erreur de connexion:", err.message);
    res.status(500).json({ msg: "Erreur serveur" });
  }
};

// Autres méthodes pour la gestion du profil des utilisateurs ici...

exports.getUserProfile = async (req, res) => {
  try {
    // Récupérer l'utilisateur à partir de l'ID attaché à la requête
    const user = await User.findById(req.user.id).select("-password"); // Exclure le mot de passe du résultat

    if (!user) {
      return res.status(404).json({ msg: "Utilisateur non trouvé" });
    }

    // Répondre avec les informations de l'utilisateur
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur du serveur");
  }
};
//ajouter switch role from rec to condidat
exports.updateProfile = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Récupérer l'utilisateur à partir de l'ID attaché à la requête
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: "Utilisateur non trouvé" });
    }

    // Mettre à jour les informations de l'utilisateur
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      // Hachage du nouveau mot de passe
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    // Répondre avec les informations mises à jour de l'utilisateur
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur du serveur");
  }
};
exports.getUsersProfiles = async (req, res) => {
  try {
    // Vérifiez si l'utilisateur est un admin
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ msg: "Accès refusé, vous n'avez pas les droits nécessaires" });
    }

    // Récupérer tous les utilisateurs, en excluant le mot de passe
    const users = await User.find().select("-password"); // Exclure le mot de passe

    // Retourner les utilisateurs
    res.status(200).json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Erreur serveur" });
  }
};

exports.updateUsersProfile = async (req, res) => {
  try {
    // Vérifiez si l'utilisateur est un admin
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ msg: "Accès refusé, vous n'avez pas les droits nécessaires" });
    }

    const userId = req.params.id; // Récupérer l'ID de l'utilisateur à partir des paramètres de la requête
    const updates = req.body; // Les données à mettre à jour

    // Vérifiez que l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "Utilisateur non trouvé" });
    }

    // Mettez à jour l'utilisateur
    Object.assign(user, updates); // Mettez à jour les champs de l'utilisateur
    await user.save(); // Enregistrez les modifications

    res.status(200).json({ msg: "Profil mis à jour avec succès", user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Erreur serveur" });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    // Vérifiez si l'utilisateur est un admin
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ msg: "Accès refusé, vous n'avez pas les droits nécessaires" });
    }

    const userId = req.params.id; // Récupérer l'ID de l'utilisateur à partir des paramètres de la requête

    // Vérifiez que l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "Utilisateur non trouvé" });
    }

    // Supprimer l'utilisateur
    await User.findByIdAndDelete(userId);

    res.status(200).json({ msg: "Utilisateur supprimé avec succès" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Erreur serveur" });
  }
};

exports.addUserProfile = async (req, res) => {
  try {
    // Vérifiez si l'utilisateur a le rôle d'admin
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ msg: "Accès refusé, vous n'avez pas les droits nécessaires" });
    }

    // Récupérer les champs requis
    const { name, email, password, role } = req.body;

    // Vérifiez si tous les champs requis sont présents
    if (!name || !email || !password || !role) {
      return res.status(400).json({ msg: "Tous les champs sont requis" });
    }

    // Vérifiez si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "Un utilisateur avec cet email existe déjà" });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Enregistrer l'utilisateur dans la base de données
    await newUser.save();

    res
      .status(201)
      .json({ msg: "Utilisateur ajouté avec succès", user: newUser });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Erreur serveur" });
  }
};
