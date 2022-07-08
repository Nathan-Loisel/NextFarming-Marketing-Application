var OrderController = require('../controllers/OrderController');
var OrderMiddleWare = require('../middlewares/OrderMiddleware');
var express = require('express');

const router = express.Router();

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

        if(req.body.Client.Email == undefined) {
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

router.post('/list', (req, res) => {
    if(req.session == undefined || req.session.Agent == undefined){
        res.status(400);
        res.send({
            success: false,
            message: "You are not logged in"
        });
        return;
    }

    if(req.session.Agent.Role < 0){
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

    var ValidStatus = [0, 1, 2, 3];
    if(req.body.Status == undefined || ValidStatus.indexOf(req.body.Status) == -1) {
        res.status(400);
        res.send({
            success: false,
            message: "Invalid status"
        });
        return;
    }

    OrderController.ListOrders(req, res);
});


module.exports = router;