var Database = require('../Database');


CheckDuplicateUsername = (req, res, next) => {
    Database.AgentModel.Agent.findOne({ Username: req.body.Username }, function (err, agent) {
        if (err) {
            res.status(400);
            res.send({
                success: false,
                message: "Database error"
            });
            return;
        }
        else if (agent) {
            res.status(400);
            res.send({
                success: false,
                message: "Username already exists"
            });
            return;
        }
        else {
            next();
        }
    }
    );
}

CheckDuplicateNewUsername = (req, res, next) => {
    if(req.body.Update.Username== undefined){
        next();
        return;
    }
    Database.AgentModel.Agent.findOne({ Username: req.body.Update.Username }, function (err, agent) {
        if (err) {
            res.status(400);
            res.send({
                success: false,
                message: "Database error"
            });
            return;
        }
        else if (agent) {
            if(agent.Username == req.body.Update.Username){
                next();
                return;
            }
            res.status(400);
            res.send({
                success: false,
                message: "Username already exists"
            });
            return;
        }
        else {
            next();
        }
    }
    );
}


const AgentMiddleware = {
    CheckDuplicateUsername,
    CheckDuplicateNewUsername
}


module.exports = AgentMiddleware;