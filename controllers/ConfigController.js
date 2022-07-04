var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var nodemailer = require('nodemailer');


if (!fs.existsSync(path.join(__dirname, '../config.yaml'))) {
    fs.writeFileSync(path.join(__dirname, '../config.yaml'), '', 'utf8');
}

var Config = yaml.load(fs.readFileSync(path.join(__dirname, '../config.yaml'), 'utf8'));
if(Config == undefined){
    Config = {};
}


exports.GetConfig = function(req, res) {
    res.status(200);
    res.send({
        success: true,
        message: Config
    });
    return;
}

exports.TestSMTPSettings = function(req, res) {
    var Destination = req.body.Destination;
    var Server = Config.smtp.server;
    var Port = Config.smtp.port;
    var Username = Config.smtp.username;
    var Password = Config.smtp.password;


}

exports.SetSMTPSettings = function(req, res) {
    if(Config["smtp"] == undefined) {
        Config["smtp"] = {};
    }

    if(req.body.Server != undefined){
        Config["smtp"].server = req.body.Server;
    }
    if(req.body.Port != undefined){
        Config["smtp"].port = req.body.Port;
    }
    if(req.body.Username != undefined){
        Config["smtp"].username = req.body.Username;
    }
    if(req.body.Password != undefined){
        Config["smtp"].password = req.body.Password;
    }

    SaveSettings();
    res.status(200);
    res.send({
        success: true
    });
    return;
}

function SaveSettings(){
    fs.writeFileSync(path.join(__dirname, '../config.yaml'), yaml.dump(Config), 'utf8');
}

