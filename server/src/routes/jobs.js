const { Router } = require("express");
const prisma = require("../db");
const requireAuth = require("../middleware/auth");

const router = Router();
router.use(requireAuth);

function serializeJob(job) {
  return { ...job, appliedDate: job.appliedDate.toISOString() };
}

router.get("/", async (req, res) => {
  const jobs = await prisma.job.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "desc" },
  });
  return res.status(200).json({ jobs: jobs.map(serializeJob) });
});

router.post("/", async (req, res) => {
  const { title, company, status, appliedDate, notes } = req.body ?? {};

  if (!title || !company) {
    return res.status(400).json({ error: "Missing title or company" });
  }

  const job = await prisma.job.create({
    data: {
      title,
      company,
      status,
      notes,
      appliedDate: appliedDate ? new Date(appliedDate) : new Date(),
      userId: req.userId,
    },
  });

  return res.status(200).json({ job: serializeJob(job) });
});

router.put("/:id", async (req, res) => {
  const jobId = Number(req.params.id);
  if (!Number.isInteger(jobId) || jobId <= 0) {
    return res.status(400).json({ error: "Invalid job ID" });
  }

  const { id, userId, createdAt, updatedAt, appliedDate, ...rest } = req.body ?? {};
  const data = { ...rest };
  if (appliedDate) data.appliedDate = new Date(appliedDate);

  const existing = await prisma.job.findFirst({
    where: { id: jobId, userId: req.userId },
  });
  if (!existing) {
    return res.status(404).json({ error: "Job not found" });
  }

  const job = await prisma.job.update({ where: { id: jobId }, data });
  return res.status(200).json({ job: serializeJob(job) });
});

router.delete("/:id", async (req, res) => {
  const jobId = Number(req.params.id);
  if (!Number.isInteger(jobId) || jobId <= 0) {
    return res.status(400).json({ error: "Invalid job ID" });
  }

  const existing = await prisma.job.findFirst({
    where: { id: jobId, userId: req.userId },
  });
  if (!existing) {
    return res.status(404).json({ error: "Job not found" });
  }

  await prisma.job.delete({ where: { id: jobId } });
  return res.status(200).json({ success: true });
});

module.exports = router;
