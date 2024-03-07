module.exports = (sequelize, Sequelize) => {
  const AddCourse = sequelize.define("AddCourse", {
      courseTitle: {
          type: Sequelize.STRING,
          allowNull: false,
      },
      courseDescription: {
          type: Sequelize.TEXT,
          allowNull: false,
      },
      coursePrice: {
          type: Sequelize.STRING,
          allowNull: false,
      },
      
      courseImage: {
          type: Sequelize.STRING,
      },

      assignInstructor:{
        type: Sequelize.STRING,
        allowNull: false,
      }
  });

  AddCourse.associate = (models) => {
    AddCourse.hasMany(models.UserCourse, { foreignKey: 'courseId' });
};

  

  return AddCourse;
};
