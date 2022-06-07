var Database = require('../Database');

exports.CreateAgent = function(req, res) {
    var Agent = {
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Username: req.body.Username,
        Password: req.body.Password,
        Role: req.body.Role,
        Created: Date.now(),
        Enabled: true
    }

    Database.AgentModel.Agent.create(Agent, function(err, agent){
        if(err){
            res.status(400);
            res.send({
                success: false,
                message: "Database error"
            });
            return;
        }
        else{
            res.status(200);
            res.send({
                success: true,
                message: {
                    FirstName: agent.FirstName,
                    LastName: agent.LastName,
                    Username: agent.Username,
                    Role: agent.Role,
                    Created: agent.Created,
                    Enabled: agent.Enabled
                }
            });
            return;
        }
    });
}

exports.LoginAgent = function(req, res) {
    Database.AgentModel.Agent.findOne({ Username: req.body.Username }, function(err, agent){
        if(err){
            res.status(400);
            res.send({
                success: false,
                message: "Database error"
            });
            return;
        }
        else if(agent == null){
            res.status(400);
            res.send({
                success: false,
                message: "Invalid credentials"
            });
            return;
        }
        else{
            if(agent.Password != req.body.Password){
                res.status(400);
                res.send({
                    success: false,
                    message: "Invalid credentials"
                });
                return;
            }
            else{

                req.session.Agent = agent;
                res.status(200);
                res.send({
                    success: true,
                    message: {
                        FirstName: agent.FirstName,
                        LastName: agent.LastName,
                        Username: agent.Username,
                        Role: agent.Role,
                        Created: agent.Created,
                        Enabled: agent.Enabled
                    }
                });
                return;
            }
        }
    });
}

exports.UpdateAgent = function(req, res) {
    var UpdateAgent;
    Database.AgentModel.Agent.findOne({ Username: req.body.Username }, function(err, agent){
        if(err){
            res.status(400);
            res.send({
                success: false,
                message: "Database error"
            });
            return;
        }
        else if(agent == null){
            res.status(400);
            res.send({
                success: false,
                message: "Can't find agent"
            });
            return;
        }
        else{
            UpdateAgent = agent;
        }
    });

    if(req.body.Update.FirstName != undefined){
        UpdateAgent.FirstName = req.body.Update.FirstName;
    }

    if(req.body.Update.LastName != undefined){
        UpdateAgent.LastName = req.body.Update.LastName;
    }

    if(req.body.Update.Username != undefined){
        UpdateAgent.Username = req.body.Update.Username;
    }

    if(req.body.Update.Password != undefined){
        UpdateAgent.Password = req.body.Update.Password;
    }

    if(req.body.Update.Role != undefined){
        UpdateAgent.Role = req.body.Update.Role;
    }

    UpdateAgent.save(function(err, agent){
        if(err){
            res.status(400);
            res.send({
                success: false,
                message: "Database error"
            });
            return;
        }
        else{
            res.status(200);
            res.send({
                success: true,
                message: {
                    FirstName: agent.FirstName,
                    LastName: agent.LastName,
                    Username: agent.Username,
                    Role: agent.Role,
                    Created: agent.Created,
                    Enabled: agent.Enabled
                }
            });
            return;
        }
    });
}

exports.DeleteAgent = function(req, res) {
    Database.AgentModel.Agent.findOne({ Username: req.body.Username }, function(err, agent){
        if(err){
            res.status(400);
            res.send({
                success: false,
                message: "Database error"
            });
            return;
        }
        else if(agent == null){
            res.status(400);
            res.send({
                success: false,
                message: "Can't find agent"
            });
            return;
        }
        else{
            agent.remove();
            res.status(200);
            res.send({
                success: true
            });
            return;
        }
    });
}

exports.GetAgent = function(req, res) {
    Database.AgentModel.Agent.findOne({ Username: req.body.Username }, function(err, agent){
        if(err){
            res.status(400);
            res.send({
                success: false,
                message: "Database error"
            });
            return;
        }
        else if(agent == null){
            res.status(400);
            res.send({
                success: false,
                message: "Can't find agent"
            });
            return;
        }
        else{
            res.status(200);
            res.send({
                success: true,
                message: {
                    FirstName: agent.FirstName,
                    LastName: agent.LastName,
                    Username: agent.Username,
                    Role: agent.Role,
                    Created: agent.Created,
                    Enabled: agent.Enabled
                }
            });
            return;
        }
    });
}

exports.ListAgents = function(req, res) {
    var Criterias = {};
    
    if(req.body.Criterias != undefined){
        if(req.body.Criterias.Username != undefined){
            Criterias.Username = new RegExp(req.body.Criterias.Username, 'i');
        }
    
        if(req.body.Criterias.FirstName != undefined){
            Criterias.FirstName = new RegExp(req.body.Criterias.FirstName, 'i');
        }
    
        if(req.body.Criterias.LastName != undefined){
            Criterias.LastName = new RegExp(req.body.Criterias.LastName, 'i');
        }
    
        if(req.body.Criterias.Role != undefined){
            Criterias.Role = new RegExp(req.body.Criterias.Role, 'i');
        }
    
        if(req.body.Criterias.Enabled != undefined){
            Criterias.Enabled = req.body.Criterias.Enabled;
        }
    }

    if(Object.keys(Criterias).length == 0){
        Database.AgentModel.Agent.find({}, function(err, agents){
            if(err){
                res.status(400);
                res.send({
                    success: false,
                    message: "Database error"
                });
                return;
            }
            else{
                var ReturnedAgents = [];
                for(var i = (req.body.Page - 1) * req.body.Amount; i < (req.body.Page + 1) * req.body.Amount; i++){
                    if(i >= agents.length){
                        break;
                    }
                    ReturnedAgents.push({
                        FirstName: agents[i].FirstName,
                        LastName: agents[i].LastName,
                        Username: agents[i].Username,
                        Role: agents[i].Role,
                        Created: agents[i].Created,
                        Enabled: agents[i].Enabled
                    });
                }
                res.status(200);
                res.send({
                    success: true,
                    data: ReturnedAgents
                });
                return;
            }
        });
    }else{
        Database.AgentModel.Agent.find(Criterias, function(err, agents){
            if(err){
                res.status(400);
                res.send({
                    success: false,
                    message: "Database error"
                });
                return;
            }
            else{
                res.status(200);
                var ReturnedAgents = [];
                for(var i = req.body.Page * req.body.Amount; i < (req.body.Page + 1) * req.body.Amount; i++){
                    if(i >= agents.length){
                        break;
                    }
                    ReturnedAgents.push({
                        FirstName: agents[i].FirstName,
                        LastName: agents[i].LastName,
                        Username: agents[i].Username,
                        Role: agents[i].Role,
                        Created: agents[i].Created,
                        Enabled: agents[i].Enabled
                    });
                }
                res.send({
                    success: true,
                    data: ReturnedAgents
                });
                return;
            }
        });
    }
}

exports.ChangePassword = function(req, res) {
    Database.AgentModel.Agent.findOne({ Username: req.body.Username }, function(err, agent){
        if(err){
            res.status(400);
            res.send({
                success: false,
                message: "Database error"
            });
            return;
        }
        else if(agent == null){
            res.status(400);
            res.send({
                success: false,
                message: "Can't find agent"
            });
            return;
        }
        else{
            if(agent.Password == req.body.OldPassword){
                agent.Password = req.body.NewPassword;
                agent.save(function(err, agent){
                    if(err){
                        res.status(400);
                        res.send({
                            success: false,
                            message: "Database error"
                        });
                        return;
                    }
                    else{
                        res.status(200);
                        res.send({
                            success: true
                        });
                        return;
                    }
                });
            }
            else{
                res.status(400);
                res.send({
                    success: false,
                    message: "Invalid password"
                });
                return;
            }
        }
    });
}

exports.SetPassword = function(req, res) {
    Database.AgentModel.Agent.findOne({ Username: req.body.Username }, function(err, agent){
        if(err){
            res.status(400);
            res.send({
                success: false,
                message: "Database error"
            });
            return;
        }
        else if(agent == null){
            res.status(400);
            res.send({
                success: false,
                message: "Can't find agent"
            });
            return;
        }
        else{
            agent.Password = req.body.Password;
            agent.save(function(err, agent){
                if(err){
                    res.status(400);
                    res.send({
                        success: false,
                        message: "Database error"
                    });
                    return;
                }
                else{
                    res.status(200);
                    res.send({
                        success: true
                    });
                    return;
                }
            });
        }
    });
}

