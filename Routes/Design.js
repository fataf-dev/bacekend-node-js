



// routes/design.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    courses: [/* données */],
    // etc.

    courses: [/* données design */],
    courses2: [/* ... */],
    cards: [/* ... */],
    firstRow: [/* ... */],
    secondRow: [/* ... */],
    module: { /* ... */ },
    formations: [/* ... */]
  });
});

module.exports = router;
