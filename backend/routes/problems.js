const express = require('express');
const router = express.Router();
const Problem = require('../models/DSAproblem');
const verifyToken = require('../middleware/verifyToken');

// POST: Add a new problem
router.post('/add', verifyToken, async (req, res) => {
  console.log(req.user);
  console.log("Request body:", req.body); // ✅ Debug here

  const { problemName, platform, link } = req.body;

  try {
    const newProblem = new Problem({
      userId: req.user.id,
      problemName,
      platform,
      link
    });

    const savedProblem = await newProblem.save();
    res.status(201).json(savedProblem);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});


// GET: Fetch all problems by user
router.get('/', verifyToken, async (req, res) => {
  try {
    const problems = await Problem.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(problems);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
