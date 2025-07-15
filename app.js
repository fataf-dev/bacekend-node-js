require('dotenv').config();




const express = require('express');
const passport = require('passport');
const app = express();
const cors = require('cors');

app.use(cors());

const AuthRoute = require('./Routes/auth');
const adminRoute = require('./Routes/admin');
const AuthGool = require('./Routes/google');
const ClientRoute=require('./Routes/client')
const designRoute = require('./Routes/Design');
const coursRoute=require('./Routes/CourseRoutes')
const deveRoute=require('./Routes/Developpement')
const quizRoutes = require('./Routes/QuizRoute'); 

const CommentRoute = require('./Routes/CommentRoute');



const { sequelize } = require('./models'); // ✅ seule déclaration

// Middlewares

app.use(express.json());
app.use(passport.initialize());

// Routes

app.use('/api/quizzes', CommentRoute);

// 👈 Ceci permet POST sur /api/quizzes/addComent

app.use('/api/auth', AuthRoute);
app.use('/api/admin', adminRoute);
app.use('/api/quizzes', quizRoutes);
app.use('/api/client',ClientRoute);
// Routes de catégories de cours
app.use('/courses/design', designRoute);
app.use('/api/course',coursRoute)
app.use('/api/dev',deveRoute)
app.use('/', AuthGool);






// Connexion DB
sequelize.authenticate()
  .then(() => {
    console.log('✅ Connexion à MySQL réussie');
    return sequelize.sync({ force: false });
  })
  .then(() => {
    console.log('✅ Modèles synchronisés avec la base de données');
  })
  .catch((err) => {
    console.error('❌ Erreur de base de données :', err);
  });

// Route test
app.get('/', (req, res) => {
  res.send('Bienvenue sur ton backend Udemy-clone 🚀');
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
