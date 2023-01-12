const Message = require("../models/Message");

module.exports.add_new_message = async (req, res) => {
    // create a new message object
    const { name, email, message, date } = req.body;

    try {
        // save the message to the database
        const savedMessage = await Message.create({
            name,
            email,
            message,
            date,
        });
        // return the saved message as a JSON object
        res.status(201).json({
            statusCode: 201,
            message: "Message Created",
            data: savedMessage,
        });
    } catch (err) {
        // return an error message if the massage cannot be saved
        res.json({ message: err });
    }
};

module.exports.get_all_messages = async (req, res) => {
    try {
        // query the database for all posts
        const messages = await Message.find();

        // return the posts as a JSON object
        res.status(200).json({
            statusCode: 200,
            message: "success",
            data: messages,
        });
    } catch (err) {
        // return an error message if the posts cannot be retrieved
        res.status(400).json({
            statusCode: 400,
            message: "Failed",
            data: [err],
        });
    }
};

module.exports.get_one_message = async (req, res) => {
    try {
        // get the message ID from the request
        const id = req.params.messageID;

        // query the database for the message with the specified ID
        const message = await Message.findById(id);

        // return the message as a JSON object
        res.status(200).json({
            statusCode: 200,
            message: "Success",
            data: message,
        });
    } catch (err) {
        // return an error message if the message is not found
        res.status(401).json({
            statusCode: 401,
            message: "message does not exist",
            data: err,
        });
    }
};
