var Api = require("../models/api");


exports.createApi = async (req, res, next) => {
    var api = new Api({
        apiKey: "f0a2b3c4-d5e6-4f7g-8h9i-0j1k2l3m4n5" 
    });
    data = await api.save();
    console.log(data);

    res.send(200, "Your api key: " + data.apiKey)
    next()
};
exports.authApi = async (req, res, next) => {
   var auth = await Api.findOne({ apiKey: req.header("api") });
    
   if (!auth) {
    res.json(401, "unauthorized")
   } else {
    next()
   }
    
};