const express = require("express");
var cors = require("cors");
const { logger } = require("./logger/winston.logger.js");

const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const YAML = require("yaml");
const { fileURLToPath } = require("url");
const { morganMiddleware } = require("./logger/morgan.logger.js");
const path = require("path");
const { errorHandler } = require("./middlewares/error.middleware.js");

// routes
const userRoutes = require("./routes/user.routes.js");
const articlesRoutes = require("./routes/articles.routes.js");
const commentsRoutes = require("./routes/comments.routes.js");
const profileRoutes = require("./routes/profile.routes.js");
const { seedUsers, getGeneratedCredentials } = require("./seeds/user.seed.js");

require("dotenv").config();

const swaggerFile = fs.readFileSync(
  path.resolve(__dirname, "./swagger.yaml"),
  "utf8"
);

// const swaggerDocument = YAML.parse(
//   swaggerFile?.replace(
//     "- url: ${{server}}",
//     `- url: ${process.env.PORTT || "http://localhost:8080"}/api/v1`
//   )
// );

const app = express();
app.use(morganMiddleware);
app.use(cors());

// Sync the models with the database

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const swaggerDocument = YAML.parse(
  swaggerFile?.replace(
    "- url: ${{server}}",
    `- url: ${process.env.PORTT || "http://192.168.29.18:8080"}/api/v1`
  )
);

app.use("/api/v1", userRoutes);
app.use("/api/v1", articlesRoutes);
app.use("/api/v1", commentsRoutes);
app.use("/api/v1", profileRoutes);

// Generate Seed
app.post("/api/v1/seed/user", seedUsers);
app.get("/api/v1/seed/generated-credentials", getGeneratedCredentials);

app.use(
  "/api/v1",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      docExpansion: "none", // keep all the sections collapsed by default
    },
    customSiteTitle: "Chat Application",
  })
);

// sequelize.sync().then(() => {
//   console.log("Database synced");
// });

app.use(errorHandler);

module.exports = app;
