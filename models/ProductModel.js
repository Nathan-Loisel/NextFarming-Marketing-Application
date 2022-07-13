const Mongoose = require('mongoose');

const ProductSchema = new Mongoose.Schema({
    ID: String,
    Title: String,
    ShortDescription: String,
    LongDescription: String,
    Images: [String],
    Price: Number,
    Options: [{
        ID: String,
        Title: String,
        Description: String,
        ImageURL: String,
        Price: Number,
        Available: Boolean
    }],
    Available: Boolean
}, { collection: 'Products' });


exports.Product = Mongoose.model('Product', ProductSchema);