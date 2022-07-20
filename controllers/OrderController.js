var Database = require('../Database');
var uuid = require('uuid');

exports.CreateOrder = (req, res) => {
    var Order = {
        ID: uuid.v4(),
        Client: {
            FirstName: req.body.Client.FirstName,
            LastName: req.body.Client.LastName,
            Email: req.body.Client.Email,
            Phone: null,
            Address: null,
            City: null,
            State: null,
            Zip: null,
            Country: null
        },
        Agent: req.session.Agent.Username,
        Products: req.body.Products,
        Price: req.body.Price,
        Status: 0,
        CustomerComments: null,
        AgentComments: null,
        Dates: {
            0: Date.now(),
            1: null,
            2: null,
            3: null
        }
    };

    if(req.body.Client.Email != undefined){
        Order.Client.Email = req.body.Client.Email;
    }

    if(req.body.Client.Phone != undefined){
        Order.Client.Phone = req.body.Client.Phone;
    }

    if(req.body.Client.Address != undefined){
        Order.Client.Address = req.body.Client.Address;
    }

    if(req.body.Client.City != undefined){
        Order.Client.City = req.body.Client.City;
    }

    if(req.body.Client.State != undefined){
        Order.Client.State = req.body.Client.State;
    }

    if(req.body.Client.Zip != undefined){
        Order.Client.Zip = req.body.Client.Zip;
    }

    if(req.body.Client.Country != undefined){
        Order.Client.Country = req.body.Client.Country;
    }

    

    Database.OrderModel.Order.create(Order, function (err, order) {
        if (err) {
            res.status(400);
            res.send({
                success: false,
                message: "Database error"
            });
            return;
        }

        res.status(200);
        res.send({
            success: true,
            message: order
        });
    });
}

exports.UpdateOrder = (req, res) => {
    var OrderID = req.body.OrderID;

    Database.OrderModel.Order.findOne({ ID: OrderID }, function (err, order) {
        if (err) {
            res.status(400);
            res.send({
                success: false,
                message: "Database error"
            });
            return;
        }

        if (order == null) {
            res.status(400);
            res.send({
                success: false,
                message: "Order not found"
            });
            return;
        }

        if (req.body.Client != undefined) {
            if(req.body.Client.FirstName != undefined){
                order.Client.FirstName = req.body.Client.FirstName;
            }

            if(req.body.Client.LastName != undefined){
                order.Client.LastName = req.body.Client.LastName;
            }

            if(req.body.Client.Email != undefined){
                order.Client.Email = req.body.Client.Email;
            }

            if(req.body.Client.Phone != undefined){
                order.Client.Phone = req.body.Client.Phone;
            }

            if(req.body.Client.Address != undefined){
                order.Client.Address = req.body.Client.Address;
            }

            if(req.body.Client.City != undefined){
                order.Client.City = req.body.Client.City;
            }

            if(req.body.Client.State != undefined){
                order.Client.State = req.body.Client.State;
            }

            if(req.body.Client.Zip != undefined){
                order.Client.Zip = req.body.Client.Zip;
            }

            if(req.body.Client.Country != undefined){
                order.Client.Country = req.body.Client.Country;
            }
        }

        if (req.body.Products != undefined) {
            order.Products = req.body.Products;
        }

        if (req.body.Price != undefined) {
            order.Price = req.body.Price;
        }

        if (req.body.Status != undefined) {
            if(req.body.Status == 0 || req.body.Status == 1 || req.body.Status == 2 || req.body.Status == 3){
                order.Status = req.body.Status;
                if(req.body.status == 0){
                    order.Dates[0] = Date.now();
                }

                if(req.body.status == 1){
                    order.Dates[1] = Date.now();
                }

                if(req.body.status == 2){
                    order.Dates[2] = Date.now();
                }

                if(req.body.status == 3){
                    order.Dates[3] = Date.now();
                }
            }
        }

        order.save(function (err, order) {
            if (err) {
                res.status(400);
                res.send({
                    success: false,
                    message: "Database error"
                });
                return;
            }

            res.status(200);
            res.send({
                success: true,
                message: order
            });
        });
    });
}

exports.DeleteOrder = (req, res) => {
    var OrderID = req.body.OrderID;

    Database.OrderModel.Order.findOne({ ID: OrderID }, function (err, order) {
        if (err) {
            res.status(400);
            res.send({
                success: false,
                message: "Database error"
            });
            return;
        }

        if (order == null) {
            res.status(400);
            res.send({
                success: false,
                message: "Order not found"
            });
            return;
        }

        order.remove(function (err, order) {
            if (err) {
                res.status(400);
                res.send({
                    success: false,
                    message: "Database error"
                });
                return;
            }

            res.status(200);
            res.send({
                success: true,
                message: order
            });
        });
    });
}

exports.ConfirmOrder = (req, res) => {
    var OrderID = req.body.OrderID;

    Database.OrderModel.Order.findOne({ ID: OrderID }, function (err, order) {
        if (err) {
            res.status(400);
            res.send({
                success: false,
                message: "Database error"
            });
            return;
        }

        if (order == null) {
            res.status(400);
            res.send({
                success: false,
                message: "Order not found"
            });
            return;
        }

        if(order.Status == 0){
            order.Status = 1;
            order.Dates[1] = Date.now();
        }
        else{
            res.status(400);
            res.send({
                success: false,
                message: "Order is not pending"
            });
            return;
        }

        order.save(function (err, order) {
            if (err) {
                res.status(400);
                res.send({
                    success: false,
                    message: "Database error"
                });
                return;
            }

            res.status(200);
            res.send({
                success: true,
                message: order
            });
        });
    });
}

exports.ListOrders = (req, res) => {
    var Status = req.body.Status;
    
    Database.OrderModel.Order.find({ Status: Status }, function (err, orders) {
        if (err) {
            res.status(400);
            res.send({
                success: false,
                message: "Database error"
            });
            return;
        }

        res.status(200);
        res.send({
            success: true,
            message: orders
        });
    }
    ).sort({ ID: -1 });
}

exports.GetOrder = (req, res) => {
    var OrderID = req.body.OrderID;

    Database.OrderModel.Order.findOne({ ID: OrderID }, function (err, order) {
        if (err) {
            res.status(400);
            res.send({
                success: false,
                message: "Database error"
            });
            return;
        }

        if (order == null) {
            res.status(400);
            res.send({
                success: false,
                message: "Order not found"
            });
            return;
        }

        res.status(200);
        res.send({
            success: true,
            message: order
        });
    });
}

exports.ChangeStatus = (req, res) => {
    var OrderID = req.body.OrderID;
    var Status = req.body.Status;

    Database.OrderModel.Order.findOne({ ID: OrderID }, function (err, order) {
        if (err) {
            res.status(400);
            res.send({
                success: false,
                message: "Database error"
            });
            return;
        }

        if (order == null) {
            res.status(400);
            res.send({
                success: false,
                message: "Order not found"
            });
            return;
        }

        if(Status == 0 || Status == 1 || Status == 2 || Status == 3){
            order.Status = Status;
            if(Status == 0){
                order.Dates[0] = Date.now();
            }

            if(Status == 1){
                order.Dates[1] = Date.now();
            }

            if(Status == 2){
                order.Dates[2] = Date.now();
            }

            if(Status == 3){
                order.Dates[3] = Date.now();
            }
        }
        else{
            res.status(400);
            res.send({
                success: false,
                message: "Invalid status"
            });
            return;
        }

        order.save(function (err, order) {
            if (err) {
                res.status(400);
                res.send({
                    success: false,
                    message: "Database error"
                });
                return;
            }

            res.status(200);
            res.send({
                success: true,
                message: order
            });
        });
    });
}