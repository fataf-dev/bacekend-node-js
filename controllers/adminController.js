const { Course } = require('../models');

// GET - Obtenir tous les cours
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.status(200).json({ message: 'Cours récupérés avec succès', courses });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};


domaines_info = {
  "Python":[

  ],
  
  "React js":[

  ],
  "ChatGPT":[
    
  ],
  "Machine learning":[

  ],
  "Science de données":[
    
  ],
  "Statistique":[

  ],
  "Deep learning":[
    
  ],
  "React js":[

  ],
  "CHATGPT":[
    
  ],
  "Angular":[

  ],
  "VUE JS":[
    
  ],
  "Flutter":[

  ],
  "KOTLIN":[
    
  ],

  "Développement": [
    "Développement Web",
    "Développement Mobile",
    "Développement Backend",
    "Intelligence Artificielle",
    "Jeux Vidéo"
  ],
  "Business": [
    "Gestion d’entreprise",
    "Entrepreneuriat",
    "Management",
    "Stratégie commerciale",
    "Analyse des données"
  ],
  "Finance et Comptabilité": [
    "Comptabilité générale",
    "Analyse financière",
    "Gestion de budget",
    "Investissements",
    "Fiscalité"
  ],
  "Santé et Bien-être": [
    "Nutrition",
    "Méditation",
    "Yoga",
    "Santé mentale",
    "Premiers secours"
  ],
  "Design": [
    "Design graphique",
    "UX/UI Design",
    "Design de produit",
    "Illustration numérique",
    "Animation 2D/3D"
  ],

  "Marketing": [
    "Marketing digital",
    "SEO/SEA",
    "Marketing de contenu",
    "Email marketing",
    "Marketing sur les réseaux sociaux"
  ],
  "Développement Personnel": [
    "Confiance en soi",
    "Gestion du temps",
    "Prise de parole",
    "Leadership",
    "Productivité"
  ],
  "Productivité Bureautique": [
    "Microsoft Office",
    "Google Workspace",
    "Organisation de projets",
    "Automatisation des tâches",
    "Prise de notes efficace"
  ],
  "Photographie et Vidéo": [
    "Photographie de portrait",
    "Montage vidéo",
    "Retouche photo",
    "Photographie de paysage",
    "Vlogging"
  ],
  

}     
// POST - Ajouter un cours générique
exports.createCourse = async (req, res) => {
  const { title, categories, image, badge, author, rating, reviews, price, originalPrice } = req.body;

  // Vérifie uniquement les champs obligatoires (sans categories)
  if (!title || !image || !author || !price) {
    return res.status(400).json({ message: 'Toutes les informations nécessaires doivent être fournies' });
  }

  // Catégories par défaut si non fournies
  const safeCategories = categories || [];

  try {
    const newCourse = await Course.create({
      title,
      categories: safeCategories,
      image,
      badge,
      author,
      rating,
      reviews,
      price,
      originalPrice
    });

    res.status(201).json({ message: 'Cours ajouté avec succès', course: newCourse });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};



// GET - Obtenir les cours par domaine
exports.getCoursesByCategory = async (req, res) => {
  const categoryParam = req.params.category.toLowerCase();

  try {
    const allCourses = await Course.findAll();

    const filteredCourses = allCourses.filter(course => {
      let courseCategories = [];
    
      try {
        // Vérifier si categories est un tableau ou une chaîne
        courseCategories = (course.categories && Array.isArray(course.categories)) ? course.categories : [];
      } catch (error) {
        courseCategories = [];
      }
    
      // S'assurer que categories est bien un tableau avant d'appeler .some()
      return Array.isArray(courseCategories) && courseCategories.some(
        c => typeof c === 'string' && c.toLowerCase() === categoryParam
      );
    });
    
    

    res.status(200).json({ message: `Cours pour la catégorie : ${categoryParam}`, courses: filteredCourses });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};




// PUT - Modifier un cours
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ message: 'Cours non trouvé' });

    await course.update(req.body);
    res.status(200).json({ message: 'Cours mis à jour', course });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};


exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ message: 'Cours non trouvé' });

    res.status(200).json(course);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};








// DELETE - Supprimer un cours
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ message: 'Cours non trouvé' });

    await course.destroy();
    res.status(200).json({ message: 'Cours supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};


 // assure-toi que Course est bien importé

exports.createCourse = async (req, res) => {
  const { title, categories, image, badge, author, rating, reviews, price, originalPrice, tag, domains } = req.body;

  // Vérifie les champs obligatoires
  if (!title || !image || !author || !price) {
    return res.status(400).json({ message: 'Toutes les informations nécessaires doivent être fournies' });
  }

  // Filtrer les domaines valides
  const filteredDomains = (domains || []).filter(d => domaines_info.includes(d));

  try {
    const newCourse = await Course.create({
      title,
      categories, // ["popular", "new"] => tags
      image,
      badge,
      author,
      rating,
      reviews,
      price,
      originalPrice,
      tag,
      domains: filteredDomains // ["Développement", "Design"]
    });

    res.status(201).json({ message: 'Cours ajouté avec succès', course: newCourse });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};




// GET - Récupérer les cours par domaine
exports.getCoursesByDomain = async (req, res) => {
  const domain = req.params.domain;

  if (!domaines_info.includes(domain)) {
    return res.status(400).json({ message: 'Domaine invalide' });
  }

  try {
    const courses = await Course.findAll({
      where: {
        domains: {
          [Op.contains]: [domain]
        }
      }
    });

    res.status(200).json({ message: `Cours dans le domaine ${domain}`, courses });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};