module.exports = {
  apps: [
    {
      name: "coderunner-web",
      script: "dist/src/main.web.js",
      env: {
        APP_TYPE: "web",
        NODE_ENV: "production"
      }
    },
    {
      name: "coderunner-worker",
      script: "dist/src/main.worker.js",
      env: {
        APP_TYPE: "worker",
        NODE_ENV: "production"
      }
    }
  ]
}
