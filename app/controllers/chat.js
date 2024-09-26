var Chat = require("../models/chat");

exports.createMessage = async (username, room, message) => {
    try {
        const messageToSave = new Chat({
            user: username,
            room: room,
            message: message,
        });

        await messageToSave.save();

    } catch (error) {
        console.error('Error al guardar el mensaje:', error);
    }
};

exports.getMessages = async (req, res, next) => {

    try {
        req.messages = await Chat.find({ room: req.params.id });
        return next();

    } catch (error) {
        console.error('Error:', error);
        return next();
    }
};
exports.getMessagesByUserAndRoom = async (req, res, next) => {

    try {
        req.messages = await Chat.find({ room: req.params.sala, user: req.params.user });
        res.json(req.messages)
        return next();

    } catch (error) {
        console.error('Error:', error);
        return next();
    }
};
exports.getMessagesByRoom = async (req, res, next) => {

    try {
        req.messages = await Chat.find({ room: req.params.sala});
        res.json(req.messages)
        return next();

    } catch (error) {
        console.error('Error:', error);
        return next();
    }
};
exports.createMessageAPI = async (req, res, next) => {
    try {
        req.uploadMessage = new Chat({
            user: req.body.user,
            room: req.body.room,
            message: req.body.message,
        });
        console.log(req.uploadMessage)
        data = await req.uploadMessage.save();


        res.json(data)

    } catch (error) {
        console.error('Error al guardar el mensaje:', error);
    }
};
exports.deleteChat = async (req, res, next) => {
    try {
        await Chat.deleteMany({ room: req.params.id });
        next();

    } catch (error) {
        next(error)
    }

};
