const uuid = require('uuid');
var Database = require('../Database');

exports.CreateProduct = (req, res) => {

    var Product = {
        ID: uuid.v4(),
        Title: req.body.Title,
        ShortDescription: null,
        LongDescription: null,
        ImageURL: null,
        Price: req.body.Price,
        Options: null,
        Available: true
    }

    if(req.body.ShortDescription != undefined) {
        Product.ShortDescription = req.body.ShortDescription;
    }

    if(req.body.LongDescription != undefined) {
        Product.LongDescription = req.body.LongDescription;
    }

    if(req.body.ImageURL != undefined) {
        Product.ImageURL = req.body.ImageURL;
    }

    if(req.body.Available != undefined) {
        Product.Available = req.body.Available;
    }


    Database.ProductModel.Product.create(Product, function (err, product) {
        if (err) {
            res.status(400);
            res.send({
                success: false,
                message: "Database error"
            });
            return;
        }
        
        res.send({
            success: true,
            data: product
        });
    }
    );
}

exports.UpdateProduct = (req, res) => {
    var ProductID = req.body.ProductID;

    Database.ProductModel.Product.findOne({ ID: ProductID }, function (err, product) {
        if (err) {
            res.status(400);
            res.send({
                success: false,
                message: "Database error"
            });
            return;
        }
        else {
            if (product == null) {
                res.status(400);
                res.send({
                    success: false,
                    message: "Can't find product"
                });
                return;
            }
            else {
                if(req.body.Title != undefined){
                    product.Title = req.body.Title;
                }

                if(req.body.ShortDescription != undefined){
                    product.ShortDescription = req.body.ShortDescription;
                }

                if(req.body.LongDescription != undefined){
                    product.LongDescription = req.body.LongDescription;
                }

                if(req.body.ImageURL != undefined){
                    product.ImageURL = req.body.ImageURL;
                }

                if(req.body.Price != undefined){
                    product.Price = req.body.Price;
                }

                if(req.body.Available != undefined){
                    product.Available = req.body.Available;
                }

                Database.ProductModel.Product.updateOne({ ID: ProductID }, product, function (err, product) {
                    if (err) {
                        res.status(400);
                        res.send({
                            success: false,
                            message: "Database error"
                        });
                        return;
                    }
                    else {
                        res.send({
                            success: true,
                            data: product
                        });
                    }
                }
                );
            }
        }
    }
    );
}

exports.DeleteProduct = (req, res) => {
    var ProductID = req.body.ProductID;

    Database.ProductModel.Product.findOne({ ID: ProductID }, function (err, product) {
        if (err) {
            res.status(400);
            res.send({
                success: false,
                message: "Database error"
            });
            return;
        }
        else {
            if (product == null) {
                res.status(400);
                res.send({
                    success: false,
                    message: "Can't find product"
                });
                return;
            }
            else {
                Database.ProductModel.Product.deleteOne({ ID: ProductID }, function (err, product) {
                    if (err) {
                        res.status(400);
                        res.send({
                            success: false,
                            message: "Database error"
                        });
                        return;
                    }
                    else {
                        res.send({
                            success: true,
                            data: product
                        });
                    }
                }
                );
            }
        }
    }
    );
}

exports.AddOption = (req, res) => {
    var Option = {
        ID: uuid.v4(),
        Title: req.body.Title,
        ShortDescription: null,
        LongDescription: null,
        ImageURL: null,
        Price: req.body.Price,
        Available: true
    };

    if(req.body.ShortDescription != undefined) {
        Option.ShortDescription = req.body.ShortDescription;
    }

    if(req.body.LongDescription != undefined) {
        Option.LongDescription = req.body.LongDescription;
    }

    if(req.body.ImageURL != undefined) {
        Option.ImageURL = req.body.ImageURL;
    }

    if(req.body.Available == true || req.body.Available == false) {
        Option.Available = req.body.Available;
    }

    var ProductID = req.body.ProductID;

    Database.ProductModel.Product.findOne({ ID: ProductID }, function (err, product) {
        if (err) {
            res.status(400);
            res.send({
                success: false,
                message: "Database error"
            });
            return;
        }
        else {
            if (product == null) {
                res.status(400);
                res.send({
                    success: false,
                    message: "Database error"
                });
                return;
            }
            else {
                product.Options.push(Option);
                product.save(function (err, product) {
                    if (err) {
                        res.status(400);
                        res.send({
                            success: false,
                            message: "Database error"
                        });
                        return;
                    }
                    else {
                        res.status(200);
                        res.send({
                            success: true,
                            message: product
                        });
                        return;
                    }
                });
            }
        }
    }
    );
}

exports.DeleteOption = (req, res) => {
    var OptionID = req.body.OptionID;
    var ProductID = req.body.ProductID;

    Database.ProductModel.Product.findOne({ ID: ProductID }, function (err, product) {
        if (err) {
            res.status(400);
            res.send({
                success: false,
                message: "Database error"
            });
            return;
        }
        else {
            if (product == null) {
                res.status(400);
                res.send({
                    success: false,
                    message: "Can't find product"
                });
                return;
            }
            else {
                product.Options.pull({ ID: OptionID });
                product.save(function (err, product) {
                    if (err) {
                        res.status(400);
                        res.send({
                            success: false,
                            message: "Database error"
                        });
                        return;
                    }
                    else {
                        res.status(200);
                        res.send({
                            success: true,
                            message: product
                        });
                        return;
                    }
                });
            }
        }
    }
    );
}

exports.UpdateOption = (req, res) => {
    var OptionID = req.body.OptionID;
    var ProductID = req.body.ProductID;

    Database.ProductModel.Product.findOne({ ID: ProductID }, function (err, product) {
        if (err) {
            res.status(400);
            res.send({
                success: false,
                message: "Database error"
            });
            return;
        }
        else {
            if (product == null) {
                res.status(400);
                res.send({
                    success: false,
                    message: "Can't find product"
                });
                return;
            }
            else {
                product.Options.findOne({ ID: OptionID }, function (err, option) {
                    if (err) {
                        res.status(400);
                        res.send({
                            success: false,
                            message: "Database error"
                        });
                        return;
                    }
                    else {
                        if (option == null) {
                            res.status(400);
                            res.send({
                                success: false,
                                message: "Can't find option"
                            });
                            return;
                        }
                        else {
                            if(req.body.Title != undefined){
                                option.Title = req.body.Title;
                            }

                            if(req.body.ShortDescription != undefined){
                                option.ShortDescription = req.body.ShortDescription;
                            }

                            if(req.body.LongDescription != undefined){
                                option.LongDescription = req.body.LongDescription;
                            }

                            if(req.body.ImageURL != undefined){
                                option.ImageURL = req.body.ImageURL;
                            }

                            if(req.body.Price != undefined){
                                option.Price = req.body.Price;
                            }

                            if(req.body.Available != undefined){
                                option.Available = req.body.Available;
                            }

                            option.save(function (err, option) {
                                if (err) {
                                    res.status(400);
                                    res.send({
                                        success: false,
                                        message: "Database error"
                                    });
                                    return;
                                }
                                else {
                                    res.status(200);
                                    res.send({
                                        success: true,
                                        message: product
                                    });
                                    return;
                                }
                            });
                        }
                    }
                });
            }
        }
    }
    );
}

exports.GetProduct = (req, res) => {
    var ProductID = req.body.ProductID;

    Database.ProductModel.Product.findOne({ ID: ProductID }, function (err, product) {
        if (err) {
            res.status(400);
            res.send({
                success: false,
                message: "Database error"
            });
            return;
        }
        else {
            if (product == null) {
                res.status(400);
                res.send({
                    success: false,
                    message: "Can't find product"
                });
                return;
            }
            else {
                res.status(200);
                res.send({
                    success: true,
                    message: product
                });
                return;
            }
        }
    }
    );
}

exports.ListProducts = (req, res) => {
    Database.ProductModel.Product.find({}, function (err, products) {
        if (err) {
            res.status(400);
            res.send({
                success: false,
                message: "Database error"
            });
            return;
        }
        else {
            res.status(200);
            res.send({
                success: true,
                message: products
            });
            return;
        }
    }
    );
}

exports.GetOption = (req, res) => {
    var OptionID = req.body.OptionID;

    Database.ProductModel.Option.findOne({ ID: OptionID }, function (err, option) {
        if (err) {
            res.status(400);
            res.send({
                success: false,
                message: "Database error"
            });
            return;
        }
        else {
            if (option == null) {
                res.status(400);
                res.send({
                    success: false,
                    message: "Can't find option"
                });
                return;
            }
            else {
                res.status(200);
                res.send({
                    success: true,
                    message: option
                });
                return;
            }
        }
    }
    );
}

exports.GetProductOptions = (req, res) => {
    var ProductID = req.body.ProductID;

    Database.ProductModel.Product.findOne({ ID: ProductID }, function (err, product) {
        if (err) {
            res.status(400);
            res.send({
                success: false,
                message: "Database error"
            });
            return;
        }
        else {
            if (product == null) {
                res.status(400);
                res.send({
                    success: false,
                    message: "Can't find product"
                });
                return;
            }
            else {
                res.status(200);
                res.send({
                    success: true,
                    message: product.Options
                });
                return;
            }
        }
    }
    );
}