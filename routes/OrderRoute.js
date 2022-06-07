var OrderController = require('../controllers/OrderController');
var OrderMiddleWare = require('../middlewares/OrderMiddleware');
var express = require('express');

const router = express.Router();

    //Body:
    //ID: uuidv4
    //Client:
    //    FirstName: String
    //    LastName: String
    //    Email: String
    //    Phone: String
    //    Address: String
    //    City: String
    //    State: String
    //    Zip: String
    //    Country: String
    //Agent: string
    //Products: [{
        //ProductID: uuidv4
        //Options: [{
            //OptionID: uuidv4
            //Quantity: Number
        //}]
        //Quantity: Number
    //}]
    //Price: Number
    //CreationDate: Date
    //Status: String (pending, confirmed, cancelled, archived)


router.post('/create', [OrderMiddleWare.CheckProductID],  (req, res) => {
        
        if(req.session == undefined || req.session.Agent == undefined){
            res.status(400);
            res.send({
                success: false,
                message: "You are not logged in"
            });
            return;
        }
    
        if(req.session.Agent.Role < 1){
            res.status(400);
            res.send({
                success: false,
                message: "You don't have the required permission"
            });
            return;
        }
    
        if(req.body == undefined) {
            res.status(400);
            res.send({
                success: false,
                message: "Invalid body"
            });
            return;
        }
    
        if(req.body.Client == undefined) {
            res.status(400);
            res.send({
                success: false,
                message: "Invalid client"
            });
            return;
        }
    
        if(req.body.Client.FirstName == undefined) {
            res.status(400);
            res.send({
                success: false,
                message: "Invalid client"
            });
            return;
        }
    
        if(req.body.Client.LastName == undefined) {
            res.status(400);
            res.send({
                success: false,
                message: "Invalid client"
            });
            return;
        }

        if(req.body.Price == undefined) {
            res.status(400);
            res.send({
                success: false,
                message: "Invalid price"
            });
            return;
        }

        OrderController.CreateOrder(req, res);
});

router.post('/update', [OrderMiddleWare.CheckProductID], (req, res) => {
    if(req.session == undefined || req.session.Agent == undefined){
        res.status(400);
        res.send({
            success: false,
            message: "You are not logged in"
        });
        return;
    }

    if(req.session.Agent.Role < 1){
        res.status(400);
        res.send({
            success: false,
            message: "You don't have the required permission"
        });
        return;
    }

    if(req.body == undefined) {
        res.status(400);
        res.send({
            success: false,
            message: "Invalid body"
        });
        return;
    }

    if(req.body.OrderID == undefined) {
        res.status(400);
        res.send({
            success: false,
            message: "Invalid order"
        });
        return;
    }

    OrderController.UpdateOrder(req, res);
});

router.post('/delete',  (req, res) => {
    if(req.session == undefined || req.session.Agent == undefined){
        res.status(400);
        res.send({
            success: false,
            message: "You are not logged in"
        });
        return;
    }

    if(req.session.Agent.Role < 1){
        res.status(400);
        res.send({
            success: false,
            message: "You don't have the required permission"
        });
        return;
    }

    if(req.body == undefined) {
        res.status(400);
        res.send({
            success: false,
            message: "Invalid body"
        });
        return;
    }

    if(req.body.OrderID == undefined) {
        res.status(400);
        res.send({
            success: false,
            message: "Invalid order"
        });
        return;
    }

    OrderController.DeleteOrder(req, res);
});

router.post('/confirm', (req, res) => {
    if(req.session == undefined || req.session.Agent == undefined){
        res.status(400);
        res.send({
            success: false,
            message: "You are not logged in"
        });
        return;
    }

    if(req.body == undefined) {
        res.status(400);
        res.send({
            success: false,
            message: "Invalid body"
        });
        return;
    }

    if(req.body.OrderID == undefined) {
        res.status(400);
        res.send({
            success: false,
            message: "Invalid order"
        });
        return;
    }

    OrderController.ConfirmOrder(req, res);
});

module.exports = router;