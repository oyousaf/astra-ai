// override: .env is the source of truth. Without it, stale values inherited from
// the shell or PM2's saved env silently win (e.g. an old CORS_ORIGIN).
require("dotenv").config({ override: true });

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const jobsRoutes = require("./routes/jobs");
const aiRoutes = require("./routes/ai");

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

app.get("/health", (req, res) => res.status(200).json({ ok: true }));
app.use("/auth", authRoutes);
app.use("/jobs", jobsRoutes);
app.use("/ai", aiRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`astra-ai API listening on :${port}`));
