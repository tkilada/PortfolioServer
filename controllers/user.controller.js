const router = require('express').Router();
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateSession = require('../middleware/validate-session')


router.post('/signup', async(req, res) => {
  try {
    const user = new User ({
     firstName: req.body.firstName,
     lastName: req.body.lastName,
     email: req.body.email,
     password: bcrypt.hashSync(req.body.password, 10)
    })
    const newUser = await user.save()
    const token = jwt.sign({ id: newUser._id }, 
      process.env.JWT, {
        expiresIn: 60 * 60 * 24
      })
    res.json({
      user: newUser,
      message: 'success',
      token: token
    })
  } catch (error) {
    res.json({ message: error.message})
  }
})

router.post('/login', async(req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email
    })
    if(!user) {
      throw new Error ('user not found')
    }
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if(!isPasswordMatch) {
      throw new Error('passwords do not match')
    }
    const token = jwt.sign({id: user._id}, process.env.JWT, {
      expiresIn: 60 * 60 * 24
    })
    res.json({ 
      user: user, 
      message: 'success',
      token: token
    })
  } catch (error) {
    res.json({ message: error.message })
  }
})

router.get('/', validateSession, async(req, res) => {
  try {
    const user = await User.find()
    res.json({
      user: user,
      message: 'success'
    })
  } catch (error) {
    res.json({ message: error.message })
    
  }
})

module.exports = router;