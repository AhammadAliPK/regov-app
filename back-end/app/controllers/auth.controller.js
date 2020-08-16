const db = require("../models");
const config = require("../config/auth.config");
const User = require("../models/User");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  })
    .then((user) => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User registered successfully!" });
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signupnew = (req, res) => {
  const { username, email, password, password2, imagePath } = req.body;
  let errors = [];

  if (!username || !email || !password) {
    errors.push({ msg: "Please enter all fields" });
  }

  // if (password != password2) {
  //   errors.push({ msg: 'Passwords do not match' });
  // }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    // res.render('register', {
    //   errors,
    //   name,
    //   email,
    //   password,
    //   password2
    // });
    res.send(JSON.stringify({ errors, status: false }));
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email already exists" });
        // res.render('register', {
        //   errors,
        //   name,
        //   email,
        //   password,
        //   password2
        // });
        res.send(JSON.stringify({ errors, status: false, email: email }));
      } else {
        try {
          const newUser = new User({
            username,
            email,
            password,
            imagePath,
          });

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then((user) => {
                  res.send(
                    JSON.stringify({
                      msg: "successfully registered",
                      status: true,
                      username: username,
                    })
                  );
                  //  res.redirect("/users/login");
                })
                .catch((err) => console.log(err));
            });
          });
        } catch (error) {
          res.send(
            JSON.stringify({
              msg: "registration failed",
              status: false,
              username: username,
            })
          );
        }
      }
    });
  }
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signinnew = (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username: username })
    .then((user) => {
      console.log(user);

      var passwordIsValid = bcrypt.compareSync(password, user.password);

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        accessToken: token,
        imagePath: user.imagePath,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.upload = (req, res) => {};
