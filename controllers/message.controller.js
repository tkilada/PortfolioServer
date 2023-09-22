const router = require("express").Router();
const Message = require("../models/message.model");
const validateSession = require("../middleware/validate-session");

/* 
------------MESSAGE ENDPOINtS---------------
All message endpoints use the validateSession function to make sure that the user is in face allowed to use these endpoints
*/

/* 
-----------Create new message, takes the roomid as param so that the message is linked to this room------------
-----------
*/
router.post("/create/:room_id", validateSession, async (req, res) => {
  try {
    const messageContent = new Message({
      when: new Date().toLocaleString([], {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      user: req.user,
      body: req.body.body,
      room: req.params.room_id,
    });
    const newMessage = await messageContent.save();
    res.json({
      messageContent: newMessage,
      message: "Message has been sent",
    });
  } catch (error) {
    res.json({ message: error.message });
  }
});

/* 
-----------Endpoint for update checks to make sure that the user owns the message and then if so they can edit the message----------
*/

router.put("/update/:id", validateSession, async (req, res) => {
  try {
    const filter = { _id: req.params.id, user: req.user._id };
    console.log('id: ', req.params.id)
    console.log('userid', req.user._id)
    const update = req.body;
    const returnOptions = { new: true };
    const updateMessage = await Message.findOneAndUpdate(
      filter,
      update,
      returnOptions
    );
    res.json({
      message: updateMessage ? "success" : "message not updated",
      updateMessage: updateMessage ? updateMessage : {},
    });
  } catch (error) {
    res.json({ message: error.message });
  }
});

/* 
-----------Endpoint for delete checks to make sure the user owns the mesasge and then allows the user to delete----------
*/

router.get("/:id", validateSession, async (req, res) => {
  try {
    const isOwner = await Message.find({
      _id: req.params.id,
      user: req.user._id,
    });
    if (isOwner) {
      const foundMessage = await Message.find({
        _id: req.params.id,
        user: req.user._id,
      });
      res.json({
        foundMessage: foundMessage,
        message: "Message found",
      });
    } else {
      res.json({
        message: "Message not found",
      });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});

router.delete("/delete/:id", validateSession, async (req, res) => {
  try {
    const isOwner = await Message.find({
      _id: req.params.id,
      user: req.user._id,
    });
    if (isOwner) {
      const deletedMessage = await Message.deleteOne({
        _id: req.params.id,
        user: req.user._id,
      });
      res.json({
        deletedMessage: deletedMessage,
        message:
          deletedMessage.deletedCount > 0
            ? "message was deleted"
            : "Message was not deleted",
      });
    } else {
      console.log("sorry you cannot delete this message");
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});

// !Previous delete code
/* 
 //   const isOwner = await Message.find({ _id: req.params.id, user: req.user._id})
    //   const deletedMessage = await Message.deleteOne({ _id: req.params.id, user: req.user._id })
    //   res.json({
    //     deletedMessage: deletedMessage,
    //     message: deletedMessage.deletedCount > 0 ? 'message was deleted' : 'Message was not deleted'
    //   })
    // } catch (error) {
    //   res.json({ message: error.message })
    // }
*/

/* 
  -----------Endpoint for getting all messages in a specific room takes the roomid as a param--------------------
  */

router.get("/allmessages/:room_id", validateSession, async (req, res) => {
  try {
    const filter = { room: req.params.room_id };
    const deleted = req.body.Message;
    const returnOptions = { new: true };
    const allMessages = await Message.find(
      filter,
      deleted,
      returnOptions
    ).populate("user");
    res.json({ message: allMessages });
  } catch (error) {
    res.json({ Message: error.Message });
  }
});

module.exports = router;
