var ConfigController = require('../controllers/ConfigController');
var express = require('express');
const { appendFile } = require('fs');

var router = express.Router();

router.post('/smtp', (req, res) => {
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

    ConfigController.SetSMTPSettings(req, res);
    return;
}
);

router.post('/smtp/test', (req, res) => {
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

    if(req.body == undefined) {
        res.status(400);
        res.send({
            success: false,
            message: "Invalid post body"
        });
        return;
    }

    if(req.body.Destination == undefined || req.body.Destination.length < 3 || req.body.Destination.length > 20){
        res.status(400);
        res.send({
            success: false,
            message: "Invalid destination"
        });
        return;
    }

    ConfigController.TestSMTPSettings(req, res);
    return;
}
);


router.get('/', (req, res) => {
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

    ConfigController.GetConfig(req, res);
    return;
}
);




module.exports = router;