const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/auth");
const User = require("../../models/Users");
const Driver = require("../../models/Driver");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

// router.get("/", auth, (req, res) => res.send("Auth Route"));

router.get("/", auth, async (req, res) => {
  try {
    const user = await await User.findById(req.user.id);
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please add a valid email").isEmail(),
    check("password", "please enter a password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, contact, dob, gender } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        res.status(400).json({ errors: [{ msg: "User already exists" }] });
      }

      user = new User({
        name,
        email,
        password,
        contact,
        dob,
        gender,
      });

      user.password = await bcrypt.hash(password, 12);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

      // res.send('User registered');
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

router.post(
  "/login",
  [
    check("email", "Please add a valid email").isEmail(),
    check("password", "please enter a password").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      if (email.includes("driver")) {
        let driver = await Driver.findOne({ email });
        if (!driver) {
          return res.status(400).json({ errors: [{ msg: "invalid data" }] });
        }
        const isMatch = await bcrypt.compare(password, driver.password);
        if (!isMatch) {
          return res.status(400).json({ errors: [{ msg: "invalid data" }] });
        }
        const payload = {
          driver: {
            id: driver.id,
          },
        };
        jwt.sign(
          payload,
          config.get("jwtSecret"),
          { expiresIn: 9999999 },
          (err, token) => {
            if (err) throw err;
            return res.json({ token: token, role: "driver" });
          }
        );
      } else {
        let user = await User.findOne({ email });

        if (!user) {
          return res.status(400).json({ errors: [{ msg: "invalid data" }] });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ errors: [{ msg: "invalid data" }] });
        }

        const payload = {
          user: {
            id: user.id,
          },
        };

        if (email.includes("admin")) {
          const role = "admin";
        } else {
          const role = "user";
        }

        jwt.sign(
          payload,
          config.get("jwtSecret"),
          { expiresIn: 9999999 },
          (err, token) => {
            if (err) throw err;
            res.json({ token, role });
          }
        );
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
