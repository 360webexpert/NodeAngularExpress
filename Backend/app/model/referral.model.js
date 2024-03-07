module.exports = (sequelize, Sequelize) => {
    const Referral = sequelize.define('Referral', {
      referrerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      referrerName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      refereeEmail: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      courseName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      courseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      referralCode: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed'),
        defaultValue: 'pending',
      },
    });
  
    return Referral;
  };
  