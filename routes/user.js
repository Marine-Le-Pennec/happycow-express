const express = require("express");
const router = express.Router();

// crypto
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

// Import du model user
const User = require("../Models/User");

// ROUTE SIGNUP
// Requete : name, firstName, email, phone, password
// Vérifie si un utilisateur existe déjà avec ce mail. Si non, crée un nouvel user et renvoie son ID, token, firstName et crédits (pour affichage sur homepage)

router.post("/signup", async (req, res) => {
  try {
    const emailExists = await User.findOne({
      email: req.fields.email,
    });
    if (emailExists) {
      return res
        .status(409)
        .json({ error: "This email is already registered" });
    } else {
      const userSalt = uid2(16);
      const newUser = await new User({
        username: req.fields.username,
        email: req.fields.email,
        vegetype: req.fields.vegetype,
        city: req.fields.city,
        birthday: req.fields.birthday,
        token: uid2(16),
        hash: SHA256(req.fields.password + userSalt).toString(encBase64),
        salt: userSalt,
      });
      await newUser.save();
      res.status(200).json({
        _id: newUser.id,
        token: newUser.token,
        firstName: newUser.firstName,
      });
    }
  } catch (err) {
    res.status(400).json(err.message);
  }
});

// ROUTE LOGIN
// Requete : email, password
// Vérifie si un utilisateur existe déjà avec ce mail. Si oui, vérifie le mot de passe de l'user et renvoie son ID, token, firstName

router.post("/login", async (req, res) => {
  try {
    const userFound = await User.findOne({ email: req.fields.email });
    if (userFound) {
      const userHash = SHA256(req.fields.password + userFound.salt).toString(
        encBase64
      );
      if (userHash === userFound.hash) {
        res.status(200).json({
          _id: userFound.id,
          token: userFound.token,
          firstName: userFound.firstName,
        });
      } else {
        res.status(401).json({ error: "Wrong password" });
      }
    } else {
      res
        .status(404)
        .json({ error: "This user does not exist in the database" });
    }
  } catch (err) {
    res.status(400).json(err.message);
  }
});

module.exports = router;
