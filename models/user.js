"use strict";

var bcrypt = require('bcrypt'),
    salt = bcrypt.genSaltSync(10);

var passport = require('passport'),
    localStrategy = require('passport-local').Strategy;

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
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
      } 
      ,authorize: function (userInfo, err, success){
        User.find({
          where: {
            username: userInfo.username
          }
        }).done(function (error, user) {
          if(user){
            if(User.comparePass(userInfo.password, user.password)){
               console.log("You are authorized!");
             } else {
                console.log("Wrong password buddy!");
             }
          } else {
            console.log("User is not even found...");
          }
        });
      }
    }
  });

passport.use(new localStrategy({
  // by default, local strategy uses username and password
  usernameField: 'username',
  passwordField: 'password'
}, 
function (username, password, done){
  User.find({
    where: {
      username: username
    }
  }).done(function(user){
    if(!user){
      console.log("Not user was even found");
      return done(null, false)
    } else if (user) {
        if (User.comparePass(password, user.password)) {
          console.log("Welcome!");
          return done(null, user)
        } else {
          console.log("Passwords don't match");
          done(null, false) 
        }
    }
  })


  // .done(function(error, user) {
  //     if(user){
  //       if(User.comparePass(password, user.password)){
  //         passFinished(null, user);
  //       } else {
  //         console.log("Passwords don't match");
  //         passFinished(null, null);
  //       }
  //     } else {
  //       console.log("No user was even found");
  //       passFinished(null, null);
  //     }
  //   })
  }));
return User;
};
