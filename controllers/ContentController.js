var Database = require('../Database');
var path = require('path');

exports.GetTemplate = function(req, res){
    if(req.session == undefined || req.session.Agent == undefined){
        res.sendFile(path.join(__dirname + '/../public/login.html'));
    }
    else{
        res.sendFile(path.join(__dirname + '/../public/dashboard.html'));
    }
}

exports.GetDashboardOrders = function(req, res){
    res.sendFile(path.join(__dirname + '/../public/content/dashboard/orders.html'));
}

exports.GetDashboardAgents = function(req, res){
    res.sendFile(path.join(__dirname + '/../public/content/dashboard/agents.html'));
}

exports.GetDashboardProducts = function(req, res){
    res.sendFile(path.join(__dirname + '/../public/content/dashboard/products.html'));
}

exports.GetDashboardAdministration = function(req, res){
    res.sendFile(path.join(__dirname + '/../public/content/dashboard/administration.html'));
}