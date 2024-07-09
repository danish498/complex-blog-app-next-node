const Sequelize = require("sequelize");
const DataTypes = require("sequelize");
const colors = require("colors");
const path = require("path");
const fs = require("fs");

const sequelize = new Sequelize("blog", "root", "", {
  dialect: "mysql",
  host: "localhost",
  port: 3306,
});

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log(colors.blue("Models synchronized successfully."));
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Synchronize models with the database

const db = {};

db.Sequelize = Sequelize;
db.Op = Sequelize.Op;
db.sequelize = sequelize;

//* IMPORT MODELS

db.User = require("./user.models.js")(sequelize, Sequelize, DataTypes);
db.Article = require("./articles.models.js")(sequelize, Sequelize, DataTypes);
db.Comments = require("./comments.models.js")(sequelize, Sequelize, DataTypes);
db.Tags = require("./tags.models.js")(sequelize, Sequelize, DataTypes);

//* ASSOCIATE MODELS

db.User.belongsToMany(db.User, {
  as: "followers",
  through: "Followers",
  foreignKey: "user_id",
  timestamps: false,
});

db.User.belongsToMany(db.User, {
  as: "following",
  through: "Followers",
  foreignKey: "follower_id",
  timestamps: false,
});

db.User.hasMany(db.Article, {
  foreignKey: "author_id",
  onDelete: "CASCADE",
});

db.Article.belongsTo(db.User, { as: "author", foreignKey: "author_id" });

db.User.hasMany(db.Comments, {
  foreignKey: "author_id",
  onDelete: "CASCADE",
});
db.Comments.belongsTo(db.User, { as: "author", foreignKey: "author_id" });

db.Article.hasMany(db.Comments, {
  foreignKey: "article_id",
  onDelete: "CASCADE",
});
db.Comments.belongsTo(db.Article, { foreignKey: "article_id" });

db.User.belongsToMany(db.Article, {
  as: "favorites",
  through: "Favorites",
  timestamps: false,
});

db.Article.belongsToMany(db.User, {
  through: "Favorites",
  foreignKey: "article_id",
  timestamps: false,
});

db.Article.belongsToMany(db.Tags, {
  through: "TagLists",
  as: "tagLists",
  foreignKey: "article_id",
  timestamps: false,
  onDelete: "CASCADE",
});

db.Tags.belongsToMany(db.Article, {
  through: "ArticleTags",
  uniqueKey: false,
  timestamps: false,
});

// Function to get model methods
const getModelMethods = (model) => {
  const instance = model.build();
  return {
    instanceMethods: Object.getOwnPropertyNames(
      Object.getPrototypeOf(instance)
    ).filter(
      (method) =>
        method !== "constructor" && typeof instance[method] === "function"
    ),
    classMethods: Object.getOwnPropertyNames(model).filter(
      (method) => typeof model[method] === "function"
    ),
  };
};

const generateModelMethodsFile = () => {
  const modelMethods = {
    User: getModelMethods(db.User),
    Article: getModelMethods(db.Article),
    Comments: getModelMethods(db.Comments),
    Tags: getModelMethods(db.Tags),
  };

  fs.writeFileSync(filePath, JSON.stringify(modelMethods, null, 2), "utf-8");
  console.log(`Model methods written to ${filePath}`);
};

const filePath = path.join(__dirname, "modelMethods.json");
if (!fs.existsSync(filePath)) {
  // ! RUN ONCE WHEN IT NEEDED To know about methods
  // generateModelMethodsFile();
}

(async () => {
  try {
    await sequelize.sync({ force: false }); // Set force to true for development, false for production
    console.log("Models synchronized successfully....");
  } catch (error) {
    console.error("Unable to synchronize models with the database:", error);
  }
})();

module.exports = db;
