

module.exports = (sequelize, Sequelize) => {
const UserCourse = sequelize.define('UserCourse', {
   
      courseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      courseTitle: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      courseDescription: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      coursePrice:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      courseImage:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

}); 
UserCourse.associate = (models) => {
  UserCourse.belongsTo(models.User, { foreignKey: 'userId' });
  UserCourse.belongsTo(models.AddCourse, { foreignKey: 'courseId' });
};
return  UserCourse
}

