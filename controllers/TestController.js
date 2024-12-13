const Test = require("../models/Test");

const checkAdminRole = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ msg: "Accès refusé, vous n'avez pas les droits nécessaires" });
  }
  next();
};

// Créer un nouveau test
exports.addTest = async (req, res) => {
  checkAdminRole(req, res, () => {
    // Si l'utilisateur est admin, procéder à la création du test
    Test.create(req.body)
      .then((newTest) => res.status(201).json(newTest))
      .catch((error) => res.status(400).json({ message: error.message }));
  });
};

// Récupérer tous les tests
exports.getAllTests = async (req, res) => {
  checkAdminRole(req, res, async () => {
    try {
      const tests = await Test.find();
      res.status(200).json(tests);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

// Récupérer un test par ID
exports.getTestById = async (req, res) => {
  checkAdminRole(req, res, async () => {
    try {
      const test = await Test.findById(req.params.id);
      if (!test) return res.status(404).json({ message: "Test non trouvé" });
      res.status(200).json(test);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

// Mettre à jour un test
exports.updateTest = async (req, res) => {
  checkAdminRole(req, res, async () => {
    try {
      const test = await Test.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!test) return res.status(404).json({ message: "Test non trouvé" });
      res.status(200).json(test);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
};

// Supprimer un test
exports.deleteTest = async (req, res) => {
  checkAdminRole(req, res, async () => {
    try {
      const test = await Test.findByIdAndDelete(req.params.id);
      if (!test) return res.status(404).json({ message: "Test non trouvé" });
      res.status(200).json({ message: "Test supprimé avec succès" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};
