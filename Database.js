const Mongoose = require('mongoose');

const DatabaseUrl = 'mongodb://localhost:27017/NextFarming';

Mongoose.connect(DatabaseUrl, { useNewUrlParser: true });

const AgentModel = require('./models/AgentModel');
const OrderModel = require('./models/OrderModel');
const ProductModel = require('./models/ProductModel');

module.exports = {
    AgentModel,
    OrderModel,
    ProductModel
};