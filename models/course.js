module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    title: DataTypes.STRING,
    categories: {
      type: DataTypes.JSON,
      allowNull: true,
      get() {
        const value = this.getDataValue('categories');
        if (!value) return []; // Retourne un tableau vide si null ou undefined
        return Array.isArray(value) ? value : JSON.parse(value);
      }
    },

    tag: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'new', // Valeur par défaut 'new' si aucun tag n'est spécifié
      validate: {
        isIn: [['popular', 'trending', 'new']] // Liste des valeurs autorisées
      }
    },
    image: DataTypes.STRING,
    badge: DataTypes.STRING,
    author: DataTypes.STRING,
    rating: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0, // Si l'évaluation n'est pas fournie, une valeur par défaut sera utilisée
    },
    subdomains: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    secondSubdomain: {
      type: DataTypes.JSON,
      allowNull: true
    },
    sousSousDomaines: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
   
    reviews: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    description:DataTypes.STRING,
    list1:DataTypes.STRING,
    list2:DataTypes.STRING,
    list3:DataTypes.STRING,
    originalPrice: DataTypes.FLOAT,
    domains: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    // Nouveau champ subdomains
   
    
    
  });

  // Méthode pour trouver les cours par catégorie
  Course.findByCategory = async function(category) {
    return this.findAll({
      where: sequelize.literal(`JSON_CONTAINS(categories, '"${category}"')`)
    });
  };

  return Course;
};