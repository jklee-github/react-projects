const express = require('express')
const router = express.Router()
// hashing password
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')

const User = require('../models/User')

// @route     POST api/users
// @desc      Regiter a user
// @access    Public
router.post(
  '/',
  check('name', 'Please add name').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    try {
      // mongoose findOne()
      let user = await User.findOne({ email })

      if (user) {
        return res.status(400).json({ msg: 'User already exists' })
      }

      user = new User({
        name,
        email,
        password,
      })

      // encypt the password
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password, salt)
      // save to the database
      await user.save()

      // oject want to sent in the token
      const payload = {
        user: {
          id: user.id,
        },
      }
      // to generate the token
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err
          // return back the JWT token to response
          res.json({ token })
        }
      )
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  }
)

module.exports = router
