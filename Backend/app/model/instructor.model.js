


module.exports = (sequelize, Sequelize) => {
  const instructor = sequelize.define('instructor', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
     country:{
      type: Sequelize.STRING,
      allowNull: false
     }, 
     state :{ 
      type: Sequelize.STRING,
      allowNull: false
    },
    city:{
      type: Sequelize.STRING,
      allowNull: false
    },
   
    zip: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    password:{
      type: Sequelize.STRING,
      allowNull: false,
    }

  });

    
  return instructor;
};
