const express = require('express');
const Job = require('../models/Job');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// Create a job — requires auth
router.post('/', verifyToken, async (req, res, next) => {
  try {
    const { title, company, location, salary, description } = req.body;
    if (!title || !company || !location || !salary || !description) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const job = await Job.create({
      title,
      company,
      location,
      salary,
      description,
      postedBy: req.user.id,
    });
    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
});

// Get all jobs — public
router.get('/', async (_req, res, next) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
});

// Get jobs posted by the logged-in user — requires auth
router.get('/my', verifyToken, async (req, res, next) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
});

// Apply to a job — requires auth
router.post('/:id/apply', verifyToken, async (req, res, next) => {
  try {
    const { name, email, coverLetter } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    job.applicants.push({ name, email, coverLetter: coverLetter || '', appliedBy: req.user.id });
    await job.save();
    res.json(job);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
