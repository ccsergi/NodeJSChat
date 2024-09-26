const port = 3000;
var express = require("express"),
  app = express(),
  server = require("http").createServer(app),
  mongoose = require('mongoose'),
  sessions = require('express-session'),
  path = require("path"),
  dotenv = require('dotenv').config(),
  OpenAI = require('openai'),
  io = require("socket.io")(server);

var chatController = require("./controllers/chat");
console.log(process.env.OPENAI_API_KEY)

const openai = new OpenAI.OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


server.listen(port, (err, res) => {
  if (err) console.log(`ERROR: Connecting APP ${err}`);
  else console.log(`Server is running on port ${port}`);
});

mongoose.connect(
  `mongodb://root:pass12345@mongodb:27017/chat?authSource=admin`,
  { useCreateIndex: true, useUnifiedTopology: true, useNewUrlParser: true },
  (err, res) => {
    if (err) console.log(`ERROR: connecting to Database.  ${err}`);
    else console.log(`Database Online`);
  }
);


// conexion con socket.io
io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("joinSala", (numSala) => {
    socket.join(numSala);
  });

  socket.on("newMsg", async (data) => {
    await chatController.createMessage(data.user, data.numSala, data.message)
    socket.to(data.numSala).emit("newMsg", data);

    if (data.gpt) {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            "role": "user",
            "content": data.message
          }
        ],
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      console.log(response.choices[0].message.content)
      await chatController.createMessage('ChatGPT', data.numSala, response.choices[0].message.content)
      const dataIA = {
        sender: socket.id,
        user : 'ChatGPT',
        message: response.choices[0].message.content,
        numsala: data.numSala,
        
      }
      io.to(data.numSala).emit("newMsg", dataIA);
    }
    
    console.log(data);
  });
});




//session middleware
app.use(sessions({
  secret: "scc2024",
  cookie: { maxAge: 86400000, secure: false, },
  resave: false
}));
// Import routes of our app
var routes = require("./routes/main");
var api = require("./routes/api");
// view engine setup and other configurations
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Define routes using URL path
app.use("/", routes);
app.use("/api", api);
module.exports = app;
