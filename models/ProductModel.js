const Mongoose = require('mongoose');

const ProductSchema = new Mongoose.Schema({
    ID: String,
    Title: String,
    ShortDescription: String,
    LongDescription: String,
    ImageURL: String,
    Price: Number,
    Options: [{
        ID: String,
        Title: String,
        ShortDescription: String,
        LongDescription: String,
        ImageURL: String,
        Price: Number,
        Available: Boolean
    }],
    Available: Boolean
}, { collection: 'Products' });


exports.ProductModel = Mongoose.model('Product', ProductSchema);