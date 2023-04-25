const Messages = require("../model/messageSchema")


// Get Messages
module.exports.getMessages = async (req, res, next) => {
    try {
        const { from, to } = req.body;
    
        const messages = await Messages.find({
          users: {
            $all: [from, to],
          },
        }).sort({ updatedAt: 1 });
    
        const projectedMessages = messages.map((msg) => {
          return {
            fromSelf: msg.sender.toString() === from,
            message: msg.message.text,
          };
        });
        // console.log('from', from);
        // console.log('from', to);
        // console.log('this is from messages', messages);
        // console.log(projectedMessages);
        res.status(200).json(projectedMessages);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
      }
    };



//add Messages
module.exports.addMessage = async (req, res, next) => {
    try {
        const { from, to, message } = req.body;
        const data = await Messages.create({
          message: { text: message },
          users: [from, to],
          sender: from,
        });

        return data
        ? res.status(201).json({ msg: "Message added successfully." })
        : res.status(500).json({ msg: "Failed to add message to the database." });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
      }
}
