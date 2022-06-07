var Database = require('../Database');


CheckDuplicateUsername = (req, res, next) => {
    Database.AgentModel.Agent.findOne({ Username: req.body.Username }, function (err, agent) {
        if (err) {
            res.status(400);
            res.send({
                success: false,
                message: "Invalid request"
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

const AgentMiddleware = {
    CheckDuplicateUsername
}


module.exports = AgentMiddleware;