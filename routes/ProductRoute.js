var ProductController = require('../controllers/ProductController');
const express = require('express');

const router = express.Router();

    //Body:
    //ID: uuidv4
    //Title: String
    //ShortDescription: String Optional
    //LongDescription: String Optional
    //ImageURL: String Optional
    //Price: Number
    //Options: [{ //Optional
    //    ID: uuidv4
    //    Title: String
    //    ShortDescription: String Optional
    //    LongDescription: String Optional
    //    ImageURL: String Optional
    //    Price: Number
    //    Available: Boolean Optional
    //}]
    //Available: Boolean Optional

router.post('/create',  (req, res) => {
    
    if(req.session == undefined || req.session.Agent == undefined){
        res.status(400);
        res.send({
            success: false,
            message: "You are not logged in"
        });
        return;
    }

    if(req.session.Agent.Role < 2){
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

    if(req.body.Title == undefined || req.body.Title == "") {
        res.status(400);
        res.send({
            success: false,
            message: "Invalid title"
        });
        return;
    }

    if(req.body.Price == undefined || req.body.Price == "") {
        res.status(400);
        res.send({
            success: false,
            message: "Invalid price"
        });
        return;
    }

    ProductController.CreateProduct(req, res);
    return;
});

router.post('/update',  (req, res) => {
    if(req.session == undefined || req.session.Agent == undefined){
        res.status(400);
        res.send({
            success: false,
            message: "You are not logged in"
        });
        return;
    }

    if(req.session.Agent.Role < 2){
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

    if(req.body.ProductID == undefined) {
        res.status(400);
        res.send({
            success: false,
            message: "Invalid product"
        });
        return;
    }

    ProductController.UpdateProduct(req, res);
    return;
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

    if(req.session.Agent.Role < 2){
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

    if(req.body.ProductID == undefined) {
        res.status(400);
        res.send({
            success: false,
            message: "Invalid product"
        });
        return;
    }

    ProductController.DeleteProduct(req, res);
    return;
});

router.post('/options/add', (req, res) => {
    if(req.session == undefined || req.session.Agent == undefined){
        res.status(400);
        res.send({
            success: false,
            message: "You are not logged in"
        });
        return;
    }

    if(req.session.Agent.Role < 2){
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

    if(req.body.ProductID == undefined){
        res.status(400);
        res.send({
            success: false,
            message: "Invalid product"
        });
        return;
    }

    if(req.body.Title == undefined) {
        res.status(400);
        res.send({
            success: false,
            message: "Invalid title"
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

    ProductController.AddOption(req, res);
    return;
});

router.post('/options/delete', (req, res) => {
    if(req.session == undefined || req.session.Agent == undefined){
        res.status(400);
        res.send({
            success: false,
            message: "You are not logged in"
        });
        return;
    }

    if(req.session.Agent.Role < 2){
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

    if(req.body.ProductID == undefined || req.body.OptionID == undefined){
        res.status(400);
        res.send({
            success: false,
            message: "Invalid product"
        });
        return;
    } 

    ProductController.DeleteOption(req, res);
    return;
});

router.post('/options/update', (req, res) => {
    if(req.session == undefined || req.session.Agent == undefined){
        res.status(400);
        res.send({
            success: false,
            message: "You are not logged in"
        });
        return;
    }

    if(req.session.Agent.Role < 2){
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

    if(req.body.ProductID == undefined || req.body.OptionID == undefined){
        res.status(400);
        res.send({
            success: false,
            message: "Invalid product"
        });
        return;
    } 

    ProductController.UpdateOption(req, res);
    return;
});

router.post('/get', (req, res) => {
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

    if(req.body.ProductID == undefined){
        res.status(400);
        res.send({
            success: false,
            message: "Invalid product"
        });
        return;
    }

    ProductController.GetProduct(req, res);
    return;
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

    if(req.body == undefined) {
        res.status(400);
        res.send({
            success: false,
            message: "Invalid body"
        });
        return;
    }

    ProductController.ListProducts(req, res);
    return;
});

router.post('/options/get', (req, res) => {
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

    if(req.body.OptionID == undefined){
        res.status(400);
        res.send({
            success: false,
            message: "Invalid option"
        });
        return;
    }

    ProductController.GetOption(req, res);
    return;
});

router.post('/options/list', (req, res) => {
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

    if(req.body.ProductID == undefined){
        res.status(400);
        res.send({
            success: false,
            message: "Invalid product"
        });
        return;
    }

    ProductController.GetProductOptions(req, res);
    return;
});

module.exports = router;