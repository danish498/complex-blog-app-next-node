module.exports = (sequelize, DataTypes) => {
  const Articles = sequelize.define(
    "Articles",
    {
      article_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Articles;
};
