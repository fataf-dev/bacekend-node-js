

const { Course } = require('../models');
const { Sequelize } = require('sequelize'); 
const multer = require('multer');
const path = require('path'); // Assurez-vous que Sequelize est importé
// Définition correcte des sous-domaines par domaine
exports.createCourse = async (req, res) => {
  try {
    const {
      title,
      categories,
      badge,
      author,
      rating,
      reviews,
      description,
      list1,
      list2,
      list3,
      price,
      originalPrice,
      tag,
      domains,
      secondSubdomain,
      subdomains,
      sousSousDomaines,
    } = req.body;

    const parsedCategories = typeof categories === 'string' ? JSON.parse(categories) : categories;
    const parsedDomains = typeof domains === 'string' ? JSON.parse(domains) : domains;
    const parsedSubdomains = typeof subdomains === 'string' ? JSON.parse(subdomains) : subdomains;
    const parsedSousSousDomaines = typeof sousSousDomaines === 'string' ? JSON.parse(sousSousDomaines) : sousSousDomaines;

    // Video optionnelle
    let videoPath = null;
    if (req.file) {
      videoPath = `/uploads/videos/${req.file.filename}`;
    }

    const course = await Course.create({
      title,
      description,
      list1,
      list2,
      list3,
      categories: parsedCategories,
      badge,
      author,
      rating: rating || 0,
      reviews,
      price,
      originalPrice: originalPrice || price,
      tag,
      domains: parsedDomains,
      sousSousDomaines: parsedSousSousDomaines,
      subdomains: parsedSubdomains,
      secondSubdomain,
      video: videoPath,  // video peut être null
    });

    res.status(201).json({ message: '✅ Cours ajouté', course });
  } catch (err) {
    res.status(500).json({ message: '❌ Erreur lors de la création du cours', error: err.message });
  }
};


exports.getCoursesBySubdomain = async (req, res) => {
  const { subdomain } = req.params;

  if (!subdomain || typeof subdomain !== 'string' || subdomain.trim() === '') {
    return res.status(400).json({ message: 'Sous-domaine invalide' });
  }

  try {
    const subdomainJSON = JSON.stringify(subdomain); // Ex: '"graphic-design"'
    const courses = await Course.findAll({
      where: Sequelize.literal(`JSON_CONTAINS(subdomains, '${subdomainJSON}')`)
    });

    if (courses.length === 0) {
      return res.status(404).json({
        message: `Aucun cours trouvé pour le sous-domaine "${subdomain}"`
      });
    }

    // Assurez-vous que subdomains et domains sont traités comme des tableaux
    const coursesWithParsedFields = courses.map(course => {
      course.subdomains = JSON.parse(course.subdomains);
      course.domains = JSON.parse(course.domains);
      return course;
    });

    res.status(200).json(coursesWithParsedFields);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};




exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();  // Récupère tous les cours

    res.status(200).json(courses);
  } catch (error) {
    console.error('Erreur lors de la récupération des cours :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des cours' });
  }
};
exports.getCoursesBySousSousDomaine = async (req, res) => {
  const { SousSousDomaine } = req.params;

  console.log("Paramètres reçus :", req.params);
  console.log("SousSousDomaine reçu :", SousSousDomaine);

  if (!SousSousDomaine || typeof SousSousDomaine !== 'string' || SousSousDomaine.trim() === '') {
    return res.status(400).json({ message: 'Sous-sous-domaine invalide' });
  }

  try {
    const sousSousDomainesJSON = JSON.stringify(SousSousDomaine);

    const courses = await Course.findAll({
      where: Sequelize.literal(`JSON_CONTAINS(sousSousDomaines, '${sousSousDomainesJSON}')`)
    });

    if (courses.length === 0) {
      return res.status(404).json({
        message: `Aucun cours trouvé pour le sous-sous-domaine "${SousSousDomaine}"`
      });
    }

    const coursesWithParsedFields = courses.map(course => ({
      ...course.toJSON(),
      subdomains: typeof course.subdomains === 'string' ? JSON.parse(course.subdomains) : course.subdomains,
      domains: typeof course.domains === 'string' ? JSON.parse(course.domains) : course.domains,
      sousSousDomaines: typeof course.sousSousDomaines === 'string' ? JSON.parse(course.sousSousDomaines) : course.sousSousDomaines
    }));

    res.status(200).json(coursesWithParsedFields);

  } catch (err) {
    console.error('Erreur lors de la récupération des cours par sous-sous-domaine :', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};


exports.getCoursesBySecondSubdomain = async (req, res) => {
  const { secondSubdomain } = req.params;

  if (!secondSubdomain || typeof secondSubdomain !== 'string' || secondSubdomain.trim() === '') {
    return res.status(400).json({ message: 'Second sous-domaine invalide' });
  }

  try {
    const secondSubdomainJSON = JSON.stringify(secondSubdomain); // ex: "Méthodes classiques"

    const courses = await Course.findAll({
      where: Sequelize.literal(`JSON_CONTAINS(secondSubdomain, '${secondSubdomainJSON}')`)
    });

    if (courses.length === 0) {
      return res.status(404).json({
        message: `Aucun cours trouvé pour le second sous-domaine "${secondSubdomain}"`
      });
    }

    const coursesWithParsedFields = courses.map(course => ({
      ...course.toJSON(),
      categories: parseOrDefault(course.categories),
      domains: parseOrDefault(course.domains),
      subdomains: parseOrDefault(course.subdomains),
      sousSousDomaines: parseOrDefault(course.sousSousDomaines),
      secondSubdomain: parseOrDefault(course.secondSubdomain),
    }));

    res.status(200).json(coursesWithParsedFields);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Fonction utilitaire pour parser des champs JSON ou renvoyer un tableau vide
function parseOrDefault(value) {
  try {
    return typeof value === 'string' ? JSON.parse(value) : value;
  } catch (e) {
    return [];
  }
}




