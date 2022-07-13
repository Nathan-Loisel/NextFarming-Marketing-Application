
const multer = require('multer');
const express = require('express');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

// multer init (max file size, original file extension, rnadom file name)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './temp');
    },
    filename: function (req, file, cb) {
        var RandomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        cb(null, RandomString + path.extname(file.originalname));
    }
}
);
const upload = multer({ storage: storage});


var ProductController = require('../controllers/ProductController');


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

router.post('/images/multiple', upload.array('images', 12), async (req, res) => {
    req.body.Images = [];
    for(let i = 0; i < req.files.length; i++){
        let file = req.files[i];
        let path = './temp/' + file.filename;
        let newPath = './media/' + uuidv4() + ".png";
        await sharp(path).resize(300, 300).png().toFile(newPath);
        fs.unlink(path, (err) => {
            if(err) {
                console.log(err);
            }
        }
        );
        req.body.Images.push(newPath);
    }


    if(req.session == undefined || req.session.Agent == undefined){
        for(let i = 0; i < req.files.length; i++){
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
            message: "You are not logged in"
        });
        return;
    }

    if(req.session.Agent.Role < 2){
        for(let i = 0; i < req.files.length; i++){
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
            message: "You don't have the required permission"
        });
        return;
    }

    if(req.body == undefined) {
        for(let i = 0; i < req.files.length; i++){
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
            message: "Invalid body"
        });
        return;
    }

    if(req.body.ProductID == undefined){
        for(let i = 0; i < req.files.length; i++){
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
            message: "Invalid product"
        });
        return;
    }

    ProductController.AddMultipleImages(req, res);
    return;
}
);

router.post('/images/main', (req, res) => {
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

    if(req.body.Image == undefined){
        res.status(400);
        res.send({
            success: false,
            message: "Invalid image"
        });
        return;
    }

    ProductController.ChangeMainImage(req, res);
    return;
}
);

router.post('/images/delete', (req, res) => {
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

    if(req.body.Image == undefined){
        res.status(400);
        res.send({
            success: false,
            message: "Invalid image"
        });
        return;
    }

    ProductController.DeleteImage(req, res);
    return;
}
);

router.post('/images/push', (req, res) => {
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

    if(req.body.Image == undefined){
        res.status(400);
        res.send({
            success: false,
            message: "Invalid image"
        });
        return;
    }

    ProductController.PushImage(req, res);
    return;
}
);

router.post('/images/pull', (req, res) => {
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

    if(req.body.Image == undefined){
        res.status(400);
        res.send({
            success: false,
            message: "Invalid image"
        });
        return;
    }

    ProductController.PullImage(req, res);
    return;
}
);


module.exports = router;