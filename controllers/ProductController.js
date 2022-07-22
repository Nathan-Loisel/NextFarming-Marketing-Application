const uuid = require('uuid');
var Database = require('../Database');
const fs = require('fs');
const { count } = require('console');

exports.CreateProduct = (req, res) => {

    var Product = {
        ID: uuid.v4(),
        Title: req.body.Title,
        ShortDescription: null,
        LongDescription: null,
        Images: [],
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
        Description: null,
        ImageURL: null,
        Price: req.body.Price,
        Available: true
    };

    if(req.body.Description != undefined) {
        Option.Description = req.body.Description;
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
                if(product.Options == null) {
                    product.Options = [];
                }
                product.Options.push(Option);
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
                var index = product.Options.findIndex(x => x.ID == OptionID);
                if(index != -1) {
                    product.Options.splice(index, 1);
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

                Options = product.Options;
                var index = Options.findIndex(x => x.ID == OptionID);

                if(index == -1) {
                    res.status(400);
                    res.send({
                        success: false,
                        message: "Can't find option"
                    });
                    return;
                }

                if(req.body.Title != undefined) {
                    Options[index].Title = req.body.Title;
                }

                if(req.body.Description != undefined) {
                    Options[index].Description = req.body.Description;
                }

                if(req.body.ImageURL != undefined) {
                    Options[index].ImageURL = req.body.ImageURL;
                }

                if(req.body.Price != undefined) {
                    Options[index].Price = req.body.Price;
                }

                if(req.body.Available != undefined) {
                    Options[index].Available = req.body.Available;
                }

                product.Options = Options;

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
    var Page = req.body.Page;

    Database.ProductModel.Product.find({}, function (err, products) {
        if (err) {
            res.status(400);
            res.send({
                success: false,
                message: "Database error"
            });
            return;
        }
        var PageCount = Math.ceil(products.length / 10);
        var products = products.slice((Page - 1) * 10, Page * 10);
        res.status(200);
        res.send({
            success: true,
            message: products,
            pagecount: PageCount
        });
    }
    );
}

exports.GetOption = (req, res) => {
    var ProductID = req.body.ProductID;
    var OptionID = req.body.OptionID;

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
                var option = product.Options.find(x => x.ID == OptionID);
                if(option == undefined) {
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

exports.AddProductImages = (req, res) => {
    var ProductID = req.body.ProductID;
    Database.ProductModel.Product.findOne({ ID: ProductID }, function (err, product) {
        if (err) {
            for(var i = 0; i < req.files.length; i++) {
                fs.unlink((req.files[i].destination + req.files[i].filename), (err) => {
                    if(err) {
                        console.log(err);
                    }
                }
                );
            }
            res.status(400);
            res.send({
                success: false,
                message: "Database error"
            });
            return;
        }
        else {
            if (product == null) {
                for(var i = 0; i < req.files.length; i++) {
                    fs.unlink((req.files[i].destination + req.files[i].filename), (err) => {
                        if(err) {
                            console.log(err);
                        }
                    }
                    );
                }
                res.status(400);
                res.send({
                    success: false,
                    message: "Can't find product"
                });
                return;
            }
            else {
                for(var i = 0; i < req.body.Images.length; i++) {
                    var split = req.body.Images[i].split("/");
                    var filename = split[split.length - 1];
                    product.Images.push(filename);
                }
                Database.ProductModel.Product.updateOne({ ID: ProductID }, product, function (err, product) {
                    if (err) {
                        for(var i = 0; i < req.files.length; i++) {
                            fs.unlink((req.files[i].destination + req.files[i].filename), (err) => {
                                if(err) {
                                    console.log(err);
                                }
                            }
                            );
                        }
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

exports.ChangeProductMainImage = (req, res) => {
    var Image = req.body.Image;
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
                if (product.Images.indexOf(Image) == -1) {
                    res.status(400);
                    res.send({
                        success: false,
                        message: "Image not found"
                    });
                    return;
                }
                else {
                    product.Images.splice(0, 0, product.Images.splice(product.Images.indexOf(Image), 1)[0]);
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

exports.DeleteProductImage = (req, res) => {
    var Image = req.body.Image;
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
                if (product.Images.indexOf(Image) == -1) {
                    res.status(400);
                    res.send({
                        success: false,
                        message: "Image not found"
                    });
                    return;
                }
                else {
                    product.Images.splice(product.Images.indexOf(Image), 1);
                    file = './media/' + req.body.Image;
                    fs.unlink(file, (err) => {
                        if(err) {
                            console.log(err);
                        }
                    }
                    );
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

exports.PushProductImage = (req, res) => {
    var Image = req.body.Image;
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
                if (product.Images.indexOf(Image) == -1) {
                    res.status(400);
                    res.send({
                        success: false,
                        message: "Image not found"
                    });
                    return;
                }
                else {
                    var index = product.Images.indexOf(Image);
                    product.Images.splice(index, 0, product.Images.splice(index + 1, 1)[0]);
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

exports.PullProductImage = (req, res) => {
    var Image = req.body.Image;
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
                if (product.Images.indexOf(Image) == -1) {
                    res.status(400);
                    res.send({
                        success: false,
                        message: "Image not found"
                    });
                    return;
                }
                else {
                    var index = product.Images.indexOf(Image);
                    product.Images.splice(index - 1, 0, product.Images.splice(index, 1)[0]);
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

exports.AddOptionImages = (req, res) => {
    var Image = req.body.Image;
    var ProductID = req.body.ProductID;
    var OptionID = req.body.OptionID;
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
                if (product.Options.find(x => x.ID == OptionID) == null) {
                    res.status(400);
                    res.send({
                        success: false,
                        message: "Option not found"
                    });
                    return;
                }
                else {
                    var option = product.Options.find(x => x.ID == OptionID);
                    for(var i = 0; i < req.body.Images.length; i++) {
                        var split = req.body.Images[i].split("/");
                        var filename = split[split.length - 1];
                        option.Images.push(filename);
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
    }
    );
}

exports.ChangeOptionMainImage = (req, res) => {
    var Image = req.body.Image;
    var ProductID = req.body.ProductID;
    var OptionID = req.body.OptionID;
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
                if (product.Options.find(x => x.ID == OptionID) == null) {
                    res.status(400);
                    res.send({
                        success: false,
                        message: "Option not found"
                    });
                    return;
                }
                else {
                    var option = product.Options.find(x => x.ID == OptionID);
                    if (option.Images.indexOf(Image) == -1) {
                        res.status(400);
                        res.send({
                            success: false,
                            message: "Image not found"
                        });
                        return;
                    }
                    else {
                        option.Images.splice(0, 0, option.Images.splice(option.Images.indexOf(Image), 1)[0]);
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
    }
    );
}

exports.DeleteOptionImage = (req, res) => {
    var Image = req.body.Image;
    var ProductID = req.body.ProductID;
    var OptionID = req.body.OptionID;
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
                if (product.Options.find(x => x.ID == OptionID) == null) {
                    res.status(400);
                    res.send({
                        success: false,
                        message: "Option not found"
                    });
                    return;
                }
                else {
                    var option = product.Options.find(x => x.ID == OptionID);
                    if (option.Images.indexOf(Image) == -1) {
                        res.status(400);
                        res.send({
                            success: false,
                            message: "Image not found"
                        });
                        return;
                    }
                    else {
                        option.Images.splice(option.Images.indexOf(Image), 1);
                        file = './media/' + Image;
                        fs.unlink(file, function (err) {
                            if (err) {
                                res.status(400);
                                res.send({
                                    success: false,
                                    message: "Image not found"
                                });
                                return;
                            }
                        }
                        );
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
    }
    );
}

exports.PushOptionImage = (req, res) => {
    var Image = req.body.Image;
    var ProductID = req.body.ProductID;
    var OptionID = req.body.OptionID;
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
                if (product.Options.find(x => x.ID == OptionID) == null) {
                    res.status(400);
                    res.send({
                        success: false,
                        message: "Option not found"
                    });
                    return;
                }
                else {
                    var option = product.Options.find(x => x.ID == OptionID);
                    if (option.Images.indexOf(Image) == -1) {
                        res.status(400);
                        res.send({
                            success: false,
                            message: "Image not found"
                        });
                        return;
                    }
                    else {
                        var index = option.Images.indexOf(Image);
                        option.Images.splice(index, 0, option.Images.splice(index + 1, 1)[0]);
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
    }
    );
}

exports.PullOptionImage = (req, res) => {
    var Image = req.body.Image;
    var ProductID = req.body.ProductID;
    var OptionID = req.body.OptionID;
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
                if (product.Options.find(x => x.ID == OptionID) == null) {
                    res.status(400);
                    res.send({
                        success: false,
                        message: "Option not found"
                    });
                    return;
                }
                else {
                    var option = product.Options.find(x => x.ID == OptionID);
                    if (option.Images.indexOf(Image) == -1) {
                        res.status(400);
                        res.send({
                            success: false,
                            message: "Image not found"
                        });
                        return;
                    }
                    else {
                        var index = option.Images.indexOf(Image);
                        option.Images.splice(index, 0, option.Images.splice(index - 1, 1)[0]);
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
    }
    );
}

exports.Delete