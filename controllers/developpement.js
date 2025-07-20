

const { Course } = require('../models');
const { Sequelize } = require('sequelize');  // Assurez-vous que Sequelize est importé
// Définition correcte des sous-domaines par domaine
exports.createCourse = async (req, res) => {
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ message: '❌ Le corps de la requête est vide ou invalide' });
  }

  let { title, categories, image, badge, author, rating, reviews, description, list1, list2, list3, price, originalPrice, tag, domains, secondSubdomain, subdomains, sousSousDomaines } = req.body;

  // Parsing JSON strings
  try {
    if (typeof categories === 'string' && categories.trim() !== '') categories = JSON.parse(categories);
    if (typeof domains === 'string' && domains.trim() !== '') domains = JSON.parse(domains);
    if (typeof subdomains === 'string' && subdomains.trim() !== '') subdomains = JSON.parse(subdomains);
    if (typeof sousSousDomaines === 'string' && sousSousDomaines.trim() !== '') sousSousDomaines = JSON.parse(sousSousDomaines);
  } catch (e) {
    return res.status(400).json({ message: '❌ Un des champs JSON est mal formé.' });
  }

  if (!title || !image || !author || !price) {
    return res.status(400).json({ message: 'Toutes les informations nécessaires doivent être fournies' });
  }

  // Ici je mets juste la liste brute (tu peux améliorer plus tard)
  const filteredDomains = domains || [];

  try {
    const newCourse = await Course.create({
      title,
      description,
      list1,
      list2,
      list3,
      categories,
      image,
      badge: badge || null,
      author,
      rating: rating || 0,
      reviews: reviews || null,
      price,
      originalPrice: originalPrice || price,
      tag: tag || 'new',
      domains: filteredDomains,
      sousSousDomaines: sousSousDomaines || [],
      subdomains: subdomains || [],
      secondSubdomain: secondSubdomain || []
    });

    res.status(201).json({ message: 'Cours ajouté avec succès', course: newCourse });
  } catch (err) {
    console.error('💥 Erreur lors de la création :', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
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

// Ajuste selon l'organisation de ton projet

exports.getCoursesBySousSousDomaine = async (req, res) => {
  const { soussousdomaine } = req.params;

  if (!soussousdomaine || typeof soussousdomaine !== 'string' || soussousdomaine.trim() === '') {
    return res.status(400).json({ message: 'Sous-sous-domaine invalide' });
  }

  try {
    const soussousdomaineJSON = JSON.stringify(soussousdomaine); // ex: "Cryptomonnaies"

    const courses = await Course.findAll({
      where: Sequelize.literal(`JSON_CONTAINS(sousSousDomaines, '${soussousdomaineJSON}')`)
    });

    if (courses.length === 0) {
      return res.status(404).json({
        message: `Aucun cours trouvé pour le sous-sous-domaine "${soussousdomaine}"`
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
