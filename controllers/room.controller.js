const router = require('express').Router();
const Room = require('../models/room.model');
const validateSession = require('../middleware/validate-session')

router.post('/newroom', validateSession, async(req, res) => {
  try {
    const room = new Room ({
      name: req.body.name,
      description: req.body.description,
      addedUsers: req.body.addedUsers
    })
    const newRoom = await room.save()
    res.json({
      room: newRoom,
      message: 'Room has been created'
    })
  } catch (error) {
    res.json({ message: error.message })
  }
})

router.get('/', validateSession, async(req, res) => {
  try {
    const room = await Room.find()
    res.json({ room: room, message: 'success' })
  } catch (error) {
    res.json({ message: error.message })
  }
})

router.get('/:id', validateSession, async(req, res) => {
  try {
    const room = await Room.findById({ _id: req.params.id });
    res.json({ room: room, message: 'success' })
  } catch (error) {
    res.json({ message: error.message })
  }
})




module.exports = router;

 