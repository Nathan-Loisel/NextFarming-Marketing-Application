const Mongoose = require('mongoose');
const { Product } = require('./ProductModel');

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
        ID: String,
        Ammount: Number,
        Product: Object,
        SelectedOptions: [{
            OptionID: String
        }],
    }],
    Price: Number,
    Status: Number,
    Dates: {
        Created: Date,
        Updated: Date
    }
}, { collection: 'Orders' });


exports.Order = Mongoose.model('Order', OrderSchema);