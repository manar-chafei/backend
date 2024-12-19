const formidable = require("formidable");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const CV = require("../models/Cv");

exports.getlast = async (req, res) => {
  try {
    const userId = req.user.id; // ID de l'utilisateur authentifié

    // Récupérer le dernier CV en fonction de la date de création
    const lastCV = await CV.findOne({ userId }).sort({ createdAt: -1 });

    if (!lastCV) {
      return res.status(404).json({ msg: "No CV found for this user" });
    }

    res.json(lastCV);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
// Ajouter un nouveau CV (si nécessaire)
exports.addCV = async (req, res) => {
  try {
    const { name, email, phone, skills, experience, education } = req.body;
    const cv = new CV({
      userId: req.user.id, // ID de l'utilisateur connecté
      name,
      email,
      phone,
      skills,
      experience,
      education,
    });
    await cv.save();
    res.status(201).json({ message: "CV ajouté avec succès", cv });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer tous les CV de l'utilisateur connecté
exports.getUserCVs = async (req, res) => {
  try {
    const query = req.user.role === "admin" ? {} : { userId: req.user.id };
    const cvs = await CV.find(query);
    res.status(200).json(cvs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un CV par ID (et vérifier qu'il appartient à l'utilisateur connecté)
exports.getCVById = async (req, res) => {
  try {
    const query =
      req.user.role === "admin"
        ? { _id: req.params.id }
        : { _id: req.params.id, userId: req.user.id };
    const cv = await CV.findOne(query);

    if (!cv) {
      return res
        .status(404)
        .json({ message: "CV non trouvé ou accès non autorisé" });
    }
    res.status(200).json(cv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un CV (et vérifier qu'il appartient à l'utilisateur connecté)
exports.deleteCV = async (req, res) => {
  try {
    const query =
      req.user.role === "admin"
        ? { _id: req.params.id }
        : { _id: req.params.id, userId: req.user.id };
    const cv = await CV.findOneAndDelete(query);

    if (!cv) {
      return res
        .status(404)
        .json({ message: "CV non trouvé ou accès non autorisé" });
    }
    res.status(200).json({ message: "CV supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour un CV (et vérifier qu'il appartient à l'utilisateur connecté)
exports.updateCV = async (req, res) => {
  try {
    const query =
      req.user.role === "admin"
        ? { _id: req.params.id }
        : { _id: req.params.id, userId: req.user.id };
    const cv = await CV.findOneAndUpdate(query, req.body, {
      new: true,
      runValidators: true,
    });

    if (!cv) {
      return res
        .status(404)
        .json({ message: "CV non trouvé ou accès non autorisé" });
    }
    res.status(200).json(cv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fonction pour gérer l'upload et l'extraction des compétences
exports.uploadCV = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error during file upload:", err);
      return res
        .status(500)
        .json({ error: "Erreur lors du téléchargement du fichier" });
    }

    const cvFile = files.pdf[0]; // Assurez-vous que le champ de fichier est correct
    if (!cvFile) {
      return res.status(400).json({ error: "Aucun fichier CV téléchargé." });
    }

    try {
      const filePath = cvFile.filepath;
      const fileBuffer = fs.readFileSync(filePath);

      // Utilisation de pdf-parse pour extraire le texte du fichier PDF
      const data = await pdfParse(fileBuffer);
      const text = data.text;

      // Fonction pour extraire les compétences à partir du texte du CV
      const skills = extractSkills(text);

      // Sauvegarder le CV et les compétences extraites dans la base de données
      const cv = new CV({
        userId: req.user.id, // Utilisez l'ID de l'utilisateur connecté
        name: fields.name || "Nom non spécifié",
        email: fields.email || "Email non spécifié",
        phone: fields.phone || "Numéro non spécifié",
        skills: skills,
        experience: fields.experience || "Expérience non spécifiée",
        education: fields.education || "Éducation non spécifiée",
      });

      await cv.save();

      // Renvoie les compétences extraites
      res.status(201).json({ message: "CV téléchargé avec succès", skills });
    } catch (error) {
      console.error("Erreur lors du traitement du CV:", error);
      res.status(500).json({ error: "Échec du traitement du CV" });
    }
  });
};

// Fonction pour extraire des compétences à partir du texte
function extractSkills(text) {
  const skills = [];
  const skillKeywords = [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "Java",
    "SQL",
  ]; // Liste d'exemples de compétences

  skillKeywords.forEach((skill) => {
    if (text.includes(skill)) {
      skills.push(skill);
    }
  });

  return skills;
}
