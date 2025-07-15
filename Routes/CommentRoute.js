const express = require('express');
const router = express.Router();
const { addComment, getCommentsByDomain } = require('../controllers/CommentController');

router.post('/addComent', addComment); // ✅ POST
router.get('/:domain', getCommentsByDomain); // ✅ GET

module.exports = router;
