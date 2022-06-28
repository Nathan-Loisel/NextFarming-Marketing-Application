var ContentController = require('../controllers/ContentController');
const express = require('express');


const router = express.Router();

var routes = ['/', '/login', '/dashboard'];
router.get(routes, (req, res) => {
    ContentController.GetTemplate(req, res);
});

router.get('/content/dashboard/orders', (req, res) => {
    if(req.session == undefined || req.session.Agent == undefined){
        res.status(400);
        res.send({
            success: false,
            message: "You are not logged in"
        });
        return;
    }
    ContentController.GetDashboardOrders(req, res);   
}
);

router.get('/content/dashboard/agents', (req, res) => {
    if(req.session == undefined || req.session.Agent == undefined){
        res.status(400);
        res.send({
            success: false,
            message: "You are not logged in"
        });
        return;
    }
    ContentController.GetDashboardAgents(req, res);
}
);

router.get('/content/dashboard/products', (req, res) => {
    if(req.session == undefined || req.session.Agent == undefined){
        res.status(400);
        res.send({
            success: false,
            message: "You are not logged in"
        });
        return;
    }
    ContentController.GetDashboardProducts(req, res);
}
);

router.get('/content/dashboard/administration', (req, res) => {
    if(req.session == undefined || req.session.Agent == undefined){
        res.status(400);
        res.send({
            success: false,
            message: "You are not logged in"
        });
        return;
    }
    ContentController.GetDashboardAdministration(req, res);
}
);

router.get('/content/dashboard/settings', (req, res) => {
    if(req.session == undefined || req.session.Agent == undefined){
        res.status(400);
        res.send({
            success: false,
            message: "You are not logged in"
        });
        return;
    }
    ContentController.GetSettings(req, res);
}
);

module.exports = router;