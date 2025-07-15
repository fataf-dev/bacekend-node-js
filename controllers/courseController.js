const { Course } = require('../models');
const { Sequelize } = require('sequelize');  // Assurez-vous que Sequelize est importé

const domaines_info = [
  "Business",
  "Finance et Comptabilité",
  "Santé et Bien-être",
  "Design",
 
  "Marketing",
  "ChatGPT",
  "Développement",
"Informatique et Logiciel",
  "Développement Personnel",
  "Productivité Bureautique",
  "Photographie et Vidéo",
  "Machine learning",
  
  "Deep learning",
  "Python",
  "Angular",
  "Science de données ",
  "PHP",
  "React js",
  "Flutter",
  "Node",
  

];

// Fonction pour créer un cours
// Fonction pour créer un cours
exports.createCourse = async (req, res) => {
  let { title, categories, image, badge, author, rating, reviews, price, originalPrice, tag, domains } = req.body;

  // 🧠 Convertir si string JSON et non vide
  if (typeof categories === 'string' && categories.trim() !== '') categories = JSON.parse(categories);
if (typeof domains === 'string' && domains.trim() !== '') domains = JSON.parse(domains);

  // Vérifie les champs obligatoires
  if (!title || !image || !author || !price || !domains) {
    return res.status(400).json({ message: 'Toutes les informations nécessaires doivent être fournies' });
  }

  // Filtrer les domaines valides
  const filteredDomains = (domains || []).filter(d => domaines_info.includes(d));

  // Si aucun domaine n'est valide, retourne une erreur
  if (filteredDomains.length === 0) {
    return res.status(400).json({ message: 'Aucun domaine valide sélectionné' });
  }

  try {
    const newCourse = await Course.create({
      title,
      categories,  // ["popular", "new"] => tags
      image,
      badge,
      author,
      rating,
      reviews,
      price,
      originalPrice,
      tag,
      domains: filteredDomains // ["Développement"]
    });

    res.status(201).json({ message: 'Cours ajouté avec succès', course: newCourse });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

  // Assurez-vous que Sequelize est importé
  
  exports.getCoursesByDomain = async (req, res) => {
    const { domain } = req.params;
    console.log("Domaine capturé:", domain);  // Ajoute cette ligne pour le débogage
  
    // Vérification que le domaine est bien dans la liste
    if (!domaines_info.includes(domain)) {
      return res.status(400).json({ message: `Domaine invalide : ${domain}. Veuillez choisir un domaine valide.` });
    }
  
    try {
      const domainJSON = JSON.stringify([domain]); // Ex: '["Développement"]'
  
      const courses = await Course.findAll({
        where: Sequelize.literal(`JSON_CONTAINS(domains, '${domainJSON}')`)
      });
  
      if (courses.length === 0) {
        return res.status(404).json({ message: `Aucun cours trouvé pour le domaine ${domain}` });
      }
  
      res.status(200).json(courses);
    } catch (err) {
      res.status(500).json({ message: 'Erreur serveur', error: err.message });
    }
  };
  
  