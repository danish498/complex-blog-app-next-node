// user.model.js
module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define(
    "Comments",
    {
      comment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      name: {
        type: DataTypes.STRING,
        unique: true,
      },
    },
    {
      timestamps: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Comments;
};
