const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");


// LOGIN
exports.login = async (req, res, next) => {

  try {

    const { username, password } = req.body;

    const user = await UserModel.findByUsername(username);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      "supersecretkey",
      { expiresIn: "8h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });

  } catch (err) {

    next(err);

  }

};



// REGISTER
exports.register = async (req, res, next) => {

  try {

    const { username, password } = req.body;

    const existingUser = await UserModel.findByUsername(username);

    if (existingUser) {
      return res.status(400).json({
        error: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.createUser(
      username,
      hashedPassword
    );

    res.status(201).json({
      message: "User created successfully",
      user: newUser
    });

  } catch (err) {

    next(err);

  }

};