const { Course } = require('../models');
const { Sequelize } = require('sequelize');
const slugify = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/\-+/g, '-')
    .replace(/^\-+|\-+$/g, '');
};

// ✅ Définition des domaines et sous-domaines
const subdomains_info = {
  "Développement": [
    "Développement Web",
    "Développement Mobile",
    "Développement Backend",
    "Intelligence Artificielle",
    "Jeux Vidéo"
  ],
  "Business": [
    "Gestion d'entreprise",
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
  "Informatique et Logiciel": [
    "Systèmes d'exploitation",
    "Réseaux informatiques",
    "Cybersécurité",
    "Bases de données",
    "Outils logiciels"
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
  ]
};

// ✅ Génération des slugs (si besoin ailleurs)
const slugifiedData = {};
for (const [domain, subdomains] of Object.entries(subdomains_info)) {
  const domainSlug = slugify(domain);
  slugifiedData[domainSlug] = {
    name: domain,
    slug: domainSlug,
    subdomains: subdomains.map(sub => ({
      name: sub,
      slug: slugify(sub)
    }))
  };
}

// ✅ Ajout d'un cours
exports.createCourse = async (req, res) => {
  let {
    title,
    categories,
    image,
    badge,
    author,
    rating,
    reviews,
    price,
    originalPrice,
    tag,
    domains,
    subdomains
  } = req.body;

  // Convertir si JSON string
  if (typeof categories === 'string' && categories.trim() !== '') categories = JSON.parse(categories);
  if (typeof domains === 'string' && domains.trim() !== '') domains = JSON.parse(domains);
  if (typeof subdomains === 'string' && subdomains.trim() !== '') subdomains = JSON.parse(subdomains);

  // Champs obligatoires
  if (!title || !image || !author || !price || !domains) {
    return res.status(400).json({ message: 'Toutes les informations nécessaires doivent être fournies' });
  }

  // Filtrage des domaines valides
  const filteredDomains = (domains || []).filter(d =>
    Object.keys(subdomains_info).includes(d)
  );

  if (filteredDomains.length === 0) {
    return res.status(400).json({ message: 'Aucun domaine valide sélectionné' });
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
      originalPrice,
      tag,
      domains: filteredDomains,
      subdomains: subdomains || []
    });

    res.status(201).json({ message: 'Cours ajouté avec succès', course: newCourse });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ✅ Récupération des cours par sous-domaine
exports.getCoursesBySubdomain = async (req, res) => {
  const { subdomain } = req.params;

  try {
    const subdomainJSON = JSON.stringify(subdomain); // Exemple : "comptabilite-generale"
    const courses = await Course.findAll({
      where: Sequelize.literal(`JSON_CONTAINS(subdomains, '${subdomainJSON}')`)
    });

    if (courses.length === 0) {
      return res.status(404).json({ message: `Aucun cours trouvé pour le sous-domaine "${subdomain}"` });
    }

    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};









exports.createCourse = async (req, res) => {
  let { title, categories, image, badge, author, rating, reviews, price, originalPrice, tag, domains, subdomains } = req.body;

  // Convertir si string JSON et non vide
  if (typeof categories === 'string' && categories.trim() !== '') categories = JSON.parse(categories);
  if (typeof domains === 'string' && domains.trim() !== '') domains = JSON.parse(domains);
  if (typeof subdomains === 'string' && subdomains.trim() !== '') subdomains = JSON.parse(subdomains);

  // Vérifie les champs obligatoires
  if (!title || !image || !author || !price || !domains) {
    return res.status(400).json({ message: 'Toutes les informations nécessaires doivent être fournies' });
  }

  // Si domaines_info est un tableau (comme dans votre exemple précédent)
  // const filteredDomains = (domains || []).filter(d => domaines_info.includes(d));
  
  // Si domaines_info est un objet avec les domaines comme clés
  const filteredDomains = (domains || []).filter(d => 
    Array.isArray(domaines_info) 
      ? domaines_info.includes(d)
      : Object.keys(domaines_info).includes(d)
  );

  // Si aucun domaine n'est valide, retourne une erreur
  if (filteredDomains.length === 0) {
    return res.status(400).json({ message: 'Aucun domaine valide sélectionné' });
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
      originalPrice,
      tag,
      domains: filteredDomains,
      subdomains: subdomains || [] // Utiliser les subdomains fournis ou un tableau vide
    });

    res.status(201).json({ message: 'Cours ajouté avec succès', course: newCourse });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getCoursesBySubdomain = async (req, res) => {
  const { subdomain } = req.params;

  try {
    // Option 1 : Requête directe avec JSON_CONTAINS (MySQL/MariaDB)
    const subdomainJSON = JSON.stringify(subdomain); // Ex: '"graphic-design"'
    const courses = await Course.findAll({
      where: Sequelize.literal(`JSON_CONTAINS(subdomains, '${subdomainJSON}')`)
    });

    // Option 2 (Alternative pour PostgreSQL ou autres SGBD)
    // const courses = await Course.findAll({
    //   where: {
    //     subdomains: {
    //       [Sequelize.Op.contains]: [subdomain] // Utilise l'opérateur contains
    //     }
    //   }
    // });

    if (courses.length === 0) {
      return res.status(404).json({ 
        message: `Aucun cours trouvé pour le sous-domaine "${subdomain}"` 
      });
    }

    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ 
      message: 'Erreur serveur', 
      error: err.message 
    });
  }
};
