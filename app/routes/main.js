var express = require("express");
var path = require("path");
var router = express.Router();
var controllerDir = "../controllers";
var chatController = require(path.join(controllerDir, "chat"));
var userController = require(path.join(controllerDir, "user"));

router.get("/", async (req, res, next) => {
    console.log(req.query.error)
    res.render("login",{error: req.query.error})
});

router.get("/user/register", async (req, res, next) => {
    res.render("register.ejs",{error: req.query.error})
});
router.post("/user/register", userController.saveUser, async (req, res, next) => {
    //cuando usuario envia el form con datos lo guarda en la db y luego le redirige al login
    // usar controlador via middleware
    if(req.existingUser) {
        res.redirect("/user/register?error=yaExiste")
    }else if(req.user) {
        res.redirect("/?error=false")
    }
});

router.post("/user/login", userController.showUser, async (req, res, next) => {
    //cuando loguea redirige a chat/list

    if(req.session.auth) res.redirect("/chat/list")
    else res.redirect("/?error=no_user")
});

// Chat

router.get("/chat/list", async (req, res, next) => {
    //cuando loguea redirige a chat/list
    if (req.session.auth) {
        res.render("list");
    } else {
        // Si no está autenticado, redirige a la página de inicio de sesión
        res.redirect("/?error=unauthorized");
    }
});

router.get('/chat/view/:id', (req, res) => {
    // Si el usuario está autenticado, renderiza la página de chat
    if (req.session.auth) {
        res.render("chat", { username: req.session.auth.user, sala: req.params.id});
    } else {
        // Si no está autenticado, redirige a la página de inicio de sesión
        res.redirect("/?error=unauthorized");
    }
    
});

router.get('/chat/history/list', (req, res) => {
    res.render("history", {success: req.query.success})
});

router.get('/chat/history/view/:id', chatController.getMessages, (req, res) => {
    // Si el usuario está autenticado, renderiza la página de historial
    if (req.session.auth) {
        res.render("historyView", { sala: req.params.id, messages: req.messages });
    } else {
        // Si no está autenticado, redirige a la página de inicio de sesión
        res.redirect("/?error=unauthorized");
    }
});

router.get('/chat/history/delete/:id', chatController.deleteChat, (req, res) => {
    // Si el usuario está autenticado, redirige a la página de historial
    if (req.session.auth) {
        res.redirect("/chat/history/list?success=true");
    } else {
        // Si no está autenticado, redirige a la página de inicio de sesión
        res.redirect("/?error=unauthorized");
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
