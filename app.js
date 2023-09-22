require('dotenv').config();
const express = require("express");
const app = express();
const cors = require('cors')
const userController = require('./controllers/user.controller')
const roomController = require('./controllers/room.controller')
const messageController = require('./controllers/message.controller')
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASEURL)
const db = mongoose.connection

db.once('open', () => {
    console.log('connected to chatDB')
})

app.use(cors())
app.use(express.json())
app.unsubscribe(express.urlencoded())

app.use('/user', userController)
app.use('/room', roomController)
app.use('/message', messageController)

app.listen(process.env.PORT, () => {
  console.log(`server is running on port: ${process.env.PORT}`);
});