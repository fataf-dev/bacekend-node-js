const { Course, Cart,User } = require('../models');

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.status(200).json(courses);
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

exports.addToCart = async (req, res) => {
  const { courseId, quantity } = req.body;
  try {
    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ message: 'Cours non trouvé' });

    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) {
      await Cart.create({ userId: req.user.id, courses: [{ courseId, quantity }] });
    } else {
      const courseIndex = cart.courses.findIndex(item => item.courseId === courseId);
      if (courseIndex === -1) {
        cart.courses.push({ courseId, quantity });
      } else {
        cart.courses[courseIndex].quantity += quantity;
      }
      await cart.save();
    }

    res.status(200).json({ message: 'Cours ajouté au panier' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  const { courseId } = req.params;
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) return res.status(404).json({ message: 'Panier non trouvé' });

    cart.courses = cart.courses.filter(item => item.courseId !== courseId);
    await cart.save();

    res.status(200).json({ message: 'Cours supprimé du panier' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.checkout = async (req, res) => {
  const cart = await Cart.findOne({ where: { userId: req.user.id } });
  if (!cart || cart.courses.length === 0) {
    return res.status(400).json({ message: 'Panier vide' });
  }

  // Logique de paiement ici (intégration avec un service de paiement)

  cart.courses = [];
  await cart.save();

  res.status(200).json({ message: 'Achat effectué avec succès' });
};
