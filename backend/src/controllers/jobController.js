import prisma from '../prismaClient.js';

// Get all jobs for the logged-in user
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(jobs);
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Could not fetch jobs.', details: err.message });
  }
};

// Create a new job
export const createJob = async (req, res) => {
  const { title, company, status, appliedDate, notes } = req.body;
  // Validate required fields
  if (!title || !company || !status || !appliedDate) {
    return res.status(400).json({
      error:
        'Missing required fields: title, company, status, and appliedDate are required.',
    });
  }
  try {
    const job = await prisma.job.create({
      data: {
        title,
        company,
        status,
        appliedDate: new Date(appliedDate),
        notes: notes || '',
        userId: req.user.userId,
      },
    });
    res.status(201).json(job);
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Could not create job.', details: err.message });
  }
};

// Update an existing job
export const updateJob = async (req, res) => {
  const { id } = req.params;
  const { title, company, status, appliedDate, notes } = req.body;

  // Validate required fields
  if (!title || !company || !status || !appliedDate) {
    return res.status(400).json({
      error:
        'Missing required fields: title, company, status, and appliedDate are required.',
    });
  }

  try {
    // Check if job exists and belongs to user
    const job = await prisma.job.findUnique({
      where: { id: parseInt(id) },
    });
    if (!job || job.userId !== req.user.userId) {
      return res
        .status(404)
        .json({ error: 'Job not found or not owned by user.' });
    }

    const updatedJob = await prisma.job.update({
      where: { id: parseInt(id) },
      data: {
        title,
        company,
        status,
        appliedDate: new Date(appliedDate),
        notes: notes || '',
      },
    });
    res.json(updatedJob);
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Could not update job.', details: err.message });
  }
};

// Delete a job
export const deleteJob = async (req, res) => {
  const { id } = req.params;
  try {
    // Check if job exists and belongs to user
    const job = await prisma.job.findUnique({
      where: { id: parseInt(id) },
    });
    if (!job || job.userId !== req.user.userId) {
      return res
        .status(404)
        .json({ error: 'Job not found or not owned by user.' });
    }

    await prisma.job.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Job deleted successfully.' });
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Could not delete job.', details: err.message });
  }
};
