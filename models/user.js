'use strict';

var bcrypt = require('bcrypt'),
    salt = bcrypt.genSaltSync(10);

var passport = require('passport'),
    localStrategy = require('passport-local').Strategy

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      },
      comparePass: function (userpass, dbpass){
        return bcrypt.compareSync(userpass, dbpass);
      },
      hashPass: function (password){
        return bcrypt.hashSync(password, salt);
      },
      createNewUser: function (userInfo){
        User.create({
          first_name: userInfo.first_name,
          last_name: userInfo.last_name,
          username: userInfo.username,
          password: this.hashPass(userInfo.password)
        });
      },
    }
  });
  return User;
};