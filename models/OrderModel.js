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
        Product: Object,
        Amount: Number,
        SelectedOptions: [String],
    }],
    Price: Number,
    Status: Number,
    CustomerComment: String,
    ProductComments: String,
    Dates: Object
}, { collection: 'Orders' });


exports.Order = Mongoose.model('Order', OrderSchema);