var AgentController = require('../controllers/AgentController');
var AgentMiddleware = require('../middlewares/AgentMiddleware');
var express = require('express');

var router = express.Router();

router.post('/create', [ AgentMiddleware.CheckDuplicateUsername ], (req, res) => {

    if(req.session == undefined || req.session.Agent == undefined){
        res.status(400);
        res.send({
            success: false,
            message: "You are not logged in"
        });
        return;
    }

    if(req.session.Agent.Role < 2){
        res.status(400);
        res.send({
            success: false,
            message: "You don't have the required permission"
        });
        return;
    }

    if(!req.body) {
        res.status(400);
        res.send({
            success: false,
            message: "Invalid post body"
        });
        return;
    }

    const body = req.body;
    if(body.FirstName == undefined || body.LastName == undefined){
        res.status(400);
        res.send({
            success: false,
            message: "Invalid name"
        });
        return;
    }

    if(body.Username == undefined || body.Username.length < 3 || body.Username.length > 20){
        res.status(400);
        res.send({
            success: false,
            message: "Invalid username"
        });
        return;
    }

    if(body.Password == undefined || body.Password.length < 3 || body.Password.length > 20){
        res.status(400);
        res.send({
            success: false,
            message: "Invalid password"
        });
        return;
    }

    if(body.Role == undefined || !(body.Role == 0 || body.Role == 1 || body.Role == 2)){
        res.status(400);
        res.send({
            success: false,
            message: "Invalid role"
        });
        return;
    }

    AgentController.CreateAgent(req, res);
    return;
});

router.post('/login', (req, res) => {
    if(req.session != undefined && req.session.Agent != undefined){
        req.session.destroy();
    }

    if(req.body == undefined) {
        res.status(400);
        res.send({
            success: false,
            message: "Invalid post body"
        });
        return;
    }

    const body = req.body;
    if(body.Username == undefined){
        res.status(400);
        res.send({
            success: false,
            message: "Invalids username"
        });
        return;
    }

    if(body.Password == undefined){
        res.status(400);
        res.send({
            success: false,
            message: "Invalid password"
        });
        return;
    }

    AgentController.LoginAgent(req, res);
    return;
});

router.post('/logout', (req, res) => {
    if(req.session == undefined || req.session.Agent == undefined){
        res.status(400);
        res.send({
            success: false,
            message: "You are not logged in"
        });
        return;
    }

    req.session.destroy();
    res.status(200);
    res.send({
        success: true
    });
    return;
});

router.post('/update', [ AgentMiddleware.CheckDuplicateUsername ], (req, res) => {
    if(req.session == undefined || req.session.Agent == undefined){
        res.status(400);
        res.send({
            success: false,
            message: "You are not logged in"
        });
        return;
    }

    if(req.session.Agent.Role < 2){
        res.status(400);
        res.send({
            success: false,
            message: "You don't have the required permission"
        });
        return;
    }

    if(!req.body) {
        res.status(400);
        res.send({
            success: false,
            message: "Invalid post body"
        });
        return;
    }

    const body = req.body;
    if(body.Username == undefined || body.Username.length < 3 || body.Username.length > 20){
        res.status(400);
        res.send({
            success: false,
            message: "Invalid username"
        });
        return;
    }

    if(body.Update == undefined){
        res.status(400);
        res.send({
            success: false,
            message: "Invalid post body"
        });
        return;
    }

    AgentController.UpdateAgent(req, res);
    return;
});

router.post('/delete', (req, res) => {
    if(req.session == undefined || req.session.Agent == undefined){
        res.status(400);
        res.send({
            success: false,
            message: "You are not logged in"
        });
        return;
    }

    if(req.session.Agent.Role < 2){
        res.status(400);
        res.send({
            success: false,
            message: "You don't have the required permission"
        });
        return;
    }

    if(!req.body) {
        res.status(400);
        res.send({
            success: false,
            message: "Invalid body"
        });
        return;
    }

    const body = req.body;
    if(body.Username == undefined || body.Username.length < 3 || body.Username.length > 20){
        res.status(400);
        res.send({
            success: false,
            message: "Invalid username"
        });
        return;
    }

    AgentController.DeleteAgent(req, res);
    return;
});

router.get('/profile', (req, res) => {
    if(req.session == undefined || req.session.Agent == undefined){
        res.status(400);
        res.send({
            success: false,
            message: "You are not logged in"
        });
        return;
    }

    res.status(200);
    res.send({
        success: true,
        message: {
            FirstName: req.session.Agent.FirstName,
            LastName: req.session.Agent.LastName,
            Username: req.session.Agent.Username,
            Role: req.session.Agent.Role,
            Created: req.session.Agent.Created,
            Enabled: req.session.Agent.Enabled
        }
    });
    return;
});

router.get('/get', (req, res) => {
    if(req.session == undefined || req.session.Agent == undefined){
        res.status(400);
        res.send({
            success: false,
            message: "You are not logged in"
        });
        return;
    }

    if(req.session.Agent.Role < 2){
        res.status(400);
        res.send({
            success: false,
            message: "You don't have the required permission"
        });
        return;
    }

    if(req.body.Username == undefined || req.body.Username.length < 3 || req.body.Username.length > 20){
        res.status(400);
        res.send({
            success: false,
            message: "Invalid username"
        });
        return;
    }

    AgentController.GetAgent(req, res);
    return;
});

router.get('/list', (req, res) => {
    if(req.session == undefined || req.session.Agent == undefined){
        res.status(400);
        res.send({
            success: false,
            message: "You are not logged in"
        });
        return;
    }

    if(req.session.Agent.Role < 2){
        res.status(400);
        res.send({
            success: false,
            message: "You don't have the required permission"
        });
        return;
    }

    if(req.body.Amount == undefined || req.body.Amount < 1 || req.body.Amount > 100){
        req.body.Amount = 10;
    }

    if(req.body.Page == undefined || req.body.Page < 1){
        req.body.Page = 1;
    }

    AgentController.ListAgents(req, res);
    return;
});

router.get('/changepassword', (req, res) => {
    if(req.session == undefined || req.session.Agent == undefined){
        res.status(400);
        res.send({
            success: false,
            message: "You are not logged in"
        });
        return;
    }

    if(req.body.OldPassword == undefined || req.body.OldPassword.length < 3 || req.body.OldPassword.length > 20){
        res.status(400);
        res.send({
            success: false,
            message: "Invalid password"
        });
        return;
    }

    if(req.body.NewPassword == undefined || req.body.NewPassword.length < 3 || req.body.NewPassword.length > 20){
        res.status(400);
        res.send({
            success: false,
            message: "Invalid password"
        });
        return;
    }

    AgentController.ChangePassword(req, res);
    return;
});

router.get('/setpassword', (req, res) => {
    if(req.session == undefined || req.session.Agent == undefined){
        res.status(400);
        res.send({
            success: false,
            message: "You are not logged in"
        });
        return;
    }

    if(req.session.Agent.Role < 2){
        res.status(400);
        res.send({
            success: false,
            message: "You don't have the required permission"
        });
        return;
    }

    if(req.body.Username == undefined || req.body.Username.length < 3 || req.body.Username.length > 20){
        res.status(400);
        res.send({
            success: false,
            message: "Invalid username"
        });
        return;
    }

    if(req.body.Password == undefined || req.body.Password.length < 3 || req.body.Password.length > 20){
        res.status(400);
        res.send({
            success: false,
            message: "Invalid password"
        });
        return;
    }

    AgentController.SetPassword(req, res);
    return;
});

module.exports = router;