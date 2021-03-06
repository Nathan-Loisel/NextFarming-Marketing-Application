const Mongoose = require('mongoose');

const OrderSchema = new Mongoose.Schema({
    ID: String,
    Client: {
        FirstName: String,
        LastName: String,
        Email: String,
        Phone: String,
        Address: String,
        PostCode: String,
        City: String,
        Country: String
    },
    AgentID: String,
    Products: [{
        ProductID: String,
        Options: [{
            OptionID: String
        }],
        Quantity: Number
    }],
    Price: Number,
    Status: String,
    Dates: {
        Created: Date,
        Updated: Date
    }
}, { collection: 'Orders' });


exports.Order = Mongoose.model('Order', OrderSchema);