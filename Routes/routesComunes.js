// controllers/courseController.js

const { Course } = require('../models');

const validCategories = [
  "Développement",
  "Business",
  "Finance et Comptabilité",
  "Santé et Bien-être",
  "Design",
  "Informatique et Logiciel",
  "Marketing",
  "Développement Personnel",
  "Productivité Bureautique",
  "Photographie et Vidéo"
];

// POST - Ajouter un cours
exports.createCourse = async (req, res) => {
  const { category } = req.params; // catégorie venant de l'URL
  const { title, categories, image, badge, author, rating, reviews, price, originalPrice } = req.body;

  // Vérifier si la catégorie passée dans l'URL est valide
  if (!validCategories.includes(category)) {
    return res.status(400).json({ message: "Catégorie invalide" });
  }

  // Vérification des champs obligatoires
  if (!title || !categories || !image || !author || !price) {
    return res.status(400).json({ message: 'Toutes les informations nécessaires doivent être fournies' });
  }

  try {
    const newCourse = await Course.create({
      title,
      categories,
      image,
      badge,
      author,
      rating,
      reviews,
      price,
      originalPrice
    });

    res.status(201).json({ 
      message: `Cours de ${category} ajouté avec succès`, 
      course: newCourse 
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};




exports.getCoursesByCategory = async (req, res) => {
    const { category } = req.params;
  
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: "Catégorie invalide" });
    }
  
    try {
      const courses = await Course.find({ categories: category });
      res.status(200).json({ courses });
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  };
  
