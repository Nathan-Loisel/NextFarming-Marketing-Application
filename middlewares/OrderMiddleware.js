var Database = require('../Database')

CheckProductID = (req, res, next) => {
    Products = req.body.Products;
    for(var i = 0; i < Products.length; i++){
        var Product = Products[i];
        if(Product.ID == undefined || Product.Amount == undefined || !IsInteger(Product.Amount)){
            console.log(Product);
            res.status(400);
            res.send({
                success: false,
                message: "Invalid request"
            });
            return;
        }

        var DBProduct;
        Database.ProductModel.Product.findOne({ ProductID: Product.ProductID }, function (err, product) {
            if (err) {
                res.status(400);
                res.send({
                    success: false,
                    message: "Invalid request"
                });
                return;
            }
            else if (!product) {
                res.status(400);
                res.send({
                    success: false,
                    message: "Invalid request"
                });
                return;
            }
            else {
                DBProduct = product;
            }
        }
        );

        if(Product.Options == undefined){
            Product.Options = [];
        }

        for(var j = 0; j < Product.Options.length; j++){
            var Option = Product.Options[j];
            if(Option.OptionID == undefined || Option.Quantity == undefined || !IsInteger(Option.Quantity)){
                res.status(400);
                res.send({
                    success: false,
                    message: "Invalid request"
                });
                return;
            }

            var OptionExists = false;
            for(var k = 0; k < DBProduct.Options.length; k++){
                if(DBProduct.Options[k].OptionID == Option.OptionID){
                    OptionExists = true;
                    break;
                }
            }
            if(!OptionExists){
                res.status(400);
                res.send({
                    success: false,
                    message: "Invalid request"
                });
                return;
            }
        }
    }
    next();
}




const OrderMiddleWare = {
    CheckProductID
}


module.exports = OrderMiddleWare;


function IsInteger(value) {
    return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
}