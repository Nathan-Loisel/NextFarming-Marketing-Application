const Mongoose = require('mongoose');

const AgentSchema = new Mongoose.Schema({
    ID: String,
    FirstName: String,
    LastName: String,
    Username: String,
    Password: String,
    Role: Number,
    Created: String,
    Enabled: Boolean
}, { collection: 'Agents' });

exports.Agent = Mongoose.model('Agent', AgentSchema);