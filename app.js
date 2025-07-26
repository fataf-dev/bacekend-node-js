require('dotenv').config();

const express = require('express');
const passport = require('passport');
const cors = require('cors');
const path = require('path'); // ✅ Nécessaire pour path.join

const app = express();

app.use(cors());


const mime = require('mime-types');

app.use('/uploads', (req, res, next) => {
  if (req.path.endsWith('.mp4')) {
    res.set('Content-Type', 'video/mp4');
  }
  next();
});



// ✅ Servir les fichiers statiques dans "uploads"
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const AuthRoute = require('./Routes/auth');
const adminRoute = require('./Routes/admin');
const AuthGool = require('./Routes/google');
const ClientRoute = require('./Routes/client');
const designRoute = require('./Routes/Design');
const coursRoute = require('./Routes/CourseRoutes');
const deveRoute = require('./Routes/Developpement');
const quizRoutes = require('./Routes/QuizRoute'); 
const CommentRoute = require('./Routes/CommentRoute');
const { sequelize } = require('./models');

// Middlewares
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/api/quizzes', CommentRoute);
app.use('/api/auth', AuthRoute);
app.use('/api/admin', adminRoute);
app.use('/api/quizzes', quizRoutes);
app.use('/api/client', ClientRoute);
app.use('/courses/design', designRoute);
app.use('/api/course', coursRoute);
app.use('/api/dev', deveRoute);
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur démarré sur http://0.0.0.0:${PORT}`);
});
