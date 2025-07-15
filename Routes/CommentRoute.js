// Routes/CommentRoute.js
const express = require('express');
const router = express.Router();
const { addComment, getCommentsByDomain } = require('../controllers/CommentController');

router.post('/addComent', addComment);
router.get('/:domain', getCommentsByDomain);

module.exports = router;
