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
    CreatedDate: String,
    Completed: Boolean,
    CompletedDate: String
}, { collection: 'Orders' });


exports.OrderModel = Mongoose.model('Order', OrderSchema);