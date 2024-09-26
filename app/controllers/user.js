var User = require("../models/user");
var crypto = require('crypto');

exports.saveUser = async (req, res, next) => {
    try {
        req.existingUser = await User.findOne({ username: req.body.username });
        var hasheo = crypto.createHash('md5').update(req.body.password).digest('hex');
        console.log(hasheo)
        if(!req.existingUser){
            req.user = new User({ username: req.body.username, password: hasheo });
            await req.user.save()
            console.log(req.user);
        }

        next();
    } catch (err) {
        next(err); // Pass the error to the next middleware
    }
};

exports.showUser = async (req, res, next) => {
    try {
        console.log(req.session)
        var hasheo = crypto.createHash('md5').update(req.body.password).digest('hex');
        var user = await User.findOne({ username: req.body.username, password: hasheo });
        if (user) {
            req.session.auth = { user: user.username }
        } else {
            req.session.auth = null;
            //return res.status(400).json({ message: 'El usuario o contraseña es incorrecta' });
        }
        console.log(req.session)
        next()
    } catch (err) {
        next(err); // Pass the error to the next middleware
    }
};
