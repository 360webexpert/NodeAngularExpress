// user.model.js
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');
module.exports = (sequelize, Sequelize) => {
    class User extends Model {
        validPassword(password) {
          return bcrypt.compareSync(password, this.password);
        }
      }
      User.init(
        {
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        phoneNumber: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        addressLane1: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        addressLane2: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        city: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        state: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        zipCode: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        country: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        interestedInInternship: {
            type: Sequelize.STRING,
            allowNull: false,

        },
       
        universityName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        otherUniversityName: {
            type: Sequelize.STRING,
            allowNull: true
        },
        currentProgram: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        graduatingYear: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        alreadyGraduated: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        schoolEmail: {
            type: Sequelize.STRING,
           
            allowNull: true,
        },
        role: {
            type: Sequelize.ENUM('admin', 'student','instructor'),
            allowNull: false,
            defaultValue: 'student', // Set the default role to 'student'
        },
        verificationToken: {
            type: Sequelize.STRING,
        },
        isVerified: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        resetPasswordToken: {
            type: Sequelize.STRING,
            defaultValue: null,
          },
          resetPasswordExpires: {
            type: Sequelize.DATE,
            defaultValue: null,
          },
    },{
        sequelize,
        modelName: 'User',
        hooks: {
          beforeCreate: (user) => {
            user.password = bcrypt.hashSync(user.password, 10);
          },
        },
      });
    User.associate = (models) => {
        User.hasMany(models.UserCourse, { foreignKey: 'userId' });
    };

    return User;
};


