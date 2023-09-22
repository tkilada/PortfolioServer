/* 
------------- Room Model --------------
*/

const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  user: String,
  name: String,
  description: String,
  addedUsers: []
})

module.exports = mongoose.model("Room", RoomSchema)