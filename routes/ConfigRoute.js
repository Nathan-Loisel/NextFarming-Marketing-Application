var ConfigController = require('../controllers/ConfigController');
var express = require('express');
const { appendFile } = require('fs');

var router = express.Router();

router.post('/smtp/set', (req, res) => {
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

    // Body: Server, Port, Username, Password
    if(body.Server == undefined || body.Server.length < 3 || body.Server.length > 20){
        res.status(400);
        res.send({
            success: false,
            message: "Invalid server"
        });
        return;
    }

    if(body.Port == undefined || body.Port < 1 || body.Port > 65535){
        res.status(400);
        res.send({
            success: false,
            message: "Invalid port"
        });
        return;
    }

    if(body.Username == undefined || body.Username.length < 1){
        res.status(400);
        res.send({
            success: false,
            message: "Invalid username"
        });
        return;
    }

    if(body.Password == undefined || body.Password.length < 1){
        res.status(400);
        res.send({
            success: false,
            message: "Invalid password"
        });
        return;
    }

    ConfigController.SetConfig("smtp.server", body.Server);
    ConfigController.SetConfig("smtp.port", body.Port);
    ConfigController.SetConfig("smtp.username", body.Username);
    ConfigController.SetConfig("smtp.password", body.Password);
    res.status(200);
    res.send({
        success: true
    });
    return;
}
);

router.get('/smtp/get', (req, res) => {
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

    res.status(200);
    res.send({
        success: true,
        message: {
            Server: ConfigController.GetConfig("smtp.server"),
            Port: ConfigController.GetConfig("smtp.port"),
            Username: ConfigController.GetConfig("smtp.username"),
            Password: ConfigController.GetConfig("smtp.password")
        }
    });
    return;
}
);




module.exports = router;