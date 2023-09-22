/* 
----------------Model for Messages----------------
Need to Fix when field so that we show the current date
*/


const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  when: String,
  user: {type: mongoose.Types.ObjectId, ref: "User"},
  room: String,
  body: String,
})

module.exports = mongoose.model('Message', MessageSchema);