module.exports = {
  apps: [
    {
      name: "astra-ai-api",
      cwd: __dirname,
      script: "src/index.js",
      instances: 1,
      exec_mode: "fork",
      env_file: ".env",
      autorestart: true,
      max_restarts: 10,
    },
  ],
};
