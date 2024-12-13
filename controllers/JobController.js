const Job = require("../models/Job"); // Assurez-vous que le modèle Job est correctement importé
const User = require("../models/User");
//afficher myJob
exports.myJob = async (req, res) => {
  try {
    const userId = req.user.id; // ID of the logged-in user
    console.log("ID of the connected user:", userId);

    const jobId = req.params.id; // Job ID from route parameters
    console.log("Job ID to retrieve:", jobId);

    const job = await Job.findOne({ _id: jobId, user: userId }); // Ensure the job belongs to the user
    console.log("Job found:", job);

    if (!job) {
      return res.status(404).json({ message: "No job found." });
    }

    return res.status(200).json(job);
  } catch (error) {
    console.error("Error retrieving the job:", error);
    return res.status(500).json({ message: "Error retrieving the job." });
  }
};

exports.myJobs = async (req, res) => {
  try {
    const userId = req.user.id; // ID de l'utilisateur connecté
    console.log("ID de l'utilisateur connecté:", userId);

    const jobs = await Job.find({ user: userId });
    console.log("Emplois trouvés:", jobs);

    if (!jobs.length) {
      return res.status(404).json({ message: "Aucun emploi trouvé." });
    }

    return res.status(200).json(jobs);
  } catch (error) {
    console.error("Erreur lors de la récupération des emplois:", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la récupération des emplois." });
  }
};
// Ajouter un poste
exports.addJob = async (req, res) => {
  try {
    const userId = req.user.id; // Ensure req.user is populated via middleware
    const {
      title,
      description,
      company,
      location,
      salary,
      experienceRequired,
    } = req.body;

    if (
      !title ||
      !description ||
      !company ||
      !location ||
      !salary ||
      !experienceRequired
    ) {
      return res
        .status(400)
        .json({ message: "Tous les champs sont obligatoires." });
    }

    const newJob = new Job({
      title,
      description,
      company,
      location,
      salary,
      experienceRequired,
      user: userId, // Ensure the user ID is valid and matches an authenticated user
    });

    await newJob.save();
    return res.status(201).json({ message: "Emploi ajouté avec succès." });
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'emploi:", error);
    return res.status(500).json({ message: "Erreur interne du serveur." });
  }
};
// Modifier un poste
exports.updateJob = async (req, res) => {
  const { id } = req.params; // Récupérer l'ID du poste à modifier
  try {
    const updatedJob = await Job.findByIdAndUpdate(id, req.body, { new: true }); // Mettre à jour le poste
    if (!updatedJob) {
      return res.status(404).json({ msg: "Poste non trouvé" });
    }
    res.json({ msg: "Poste modifié avec succès", job: updatedJob });
  } catch (err) {
    console.error("Erreur lors de la modification du poste:", err.message);
    res.status(500).json({ msg: "Erreur lors de la modification du poste" });
  }
};

// Supprimer un poste
exports.deleteJob = async (req, res) => {
  const { id } = req.params; // Récupérer l'ID du poste à supprimer
  try {
    const deletedJob = await Job.findByIdAndDelete(id); // Supprimer le poste
    if (!deletedJob) {
      return res.status(404).json({ msg: "Poste non trouvé" });
    }
    res.json({ msg: "Poste supprimé avec succès" });
  } catch (err) {
    console.error("Erreur lors de la suppression du poste:", err.message);
    res.status(500).json({ msg: "Erreur lors de la suppression du poste" });
  }
};
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find(); // Récupère toutes les offres
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
