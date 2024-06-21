// controllers/usersController.js
"use strict";

const passport = require("passport"); // passport 모듈 요청
const User = require("../models/User"); // 사용자 모델 요청

const getUserParams = (body) => {
  return {
    username: body.username,
    name: {
      first: body.first,
      last: body.last,
    },
    email: body.email,
    password: body.password,
    profileImg: body.profileImg,
  };
};

module.exports = {
  login: (req, res) => {
    res.render("users/login", {
      page: "login",
      title: "Login",
    });
  },

  authenticate: passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: "Failed to login.",
    successRedirect: "/",
    successFlash: "Logged in!"
  }),

  logout: (req, res, next) => {
    req.logout(() => {
      console.log("Logged out!");
    });
    res.locals.redirect = "/";
    req.flash("success", "Logged out!");
    next();
  },

  index: (req, res, next) => {
    User.find()
      .then((users) => {
        res.locals.users = users;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching users: ${error.message}`);
        next(error);
      });
  },

  indexView: (req, res) => {
    res.render("users/index", {
      page: "users",
      title: "All Users",
    });
  },

  new: (req, res) => {
    res.render("users/new", {
      page: "new-user",
      title: "New User",
    });
  },

  create: (req, res, next) => {
    let userParams = {
      name: {
        first: req.body.first,
        last: req.body.last,
      },
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      profileImg: req.body.profileImg,
    };

    User.create(userParams)
      .then((user) => {
        res.locals.redirect = "/users";
        res.locals.user = user;
        next();
      })
      .catch((error) => {
        console.log(`Error saving user: ${error.message}`);
        next(error);
      });
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },

  show: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
      .then((user) => {
        res.locals.user = user;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },

  showView: (req, res) => {
    res.render("users/show", {
      page: "user-details",
      title: "User Details",
    });
  },

  edit: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
      .then((user) => {
        res.render("users/edit", {
          user: user,
          page: "edit-user",
          title: "Edit User",
        });
      })
      .catch((error) => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },

  update: (req, res, next) => {
    let userId = req.params.id,
      userParams = {
        name: {
          first: req.body.first,
          last: req.body.last,
        },
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        profileImg: req.body.profileImg,
      };

    User.findByIdAndUpdate(userId, userParams, { new: true })
      .then((user) => {
        if (user) {
          res.locals.redirect = `/users/${userId}`;
          res.locals.user = user;
          next();
        } else {
          next(new Error(`User ID ${userId} not found`));
        }
      })
      .catch((error) => {
        console.log(`Error updating user by ID: ${error.message}`);
        next(error);
      });
  },

  delete: (req, res, next) => {
    let userId = req.params.id;
    User.findByIdAndRemove(userId)
      .then((user) => {
        if (user) {
          res.locals.redirect = "/users";
          next();
        } else {
          next(new Error(`User ID ${userId} not found`));
        }
      })
      .catch((error) => {
        console.log(`Error deleting user by ID: ${error.message}`);
        next(error);
      });
  },
};
