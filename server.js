const express = require('express');
const session = require('express-session');
var bodyParser = require('body-parser');
const {TextDecoder, TextEncoder} = require("util");

const app = express();
app.use(bodyParser.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));
app.use(bodyParser.urlencoded({ extended: true }));

const Roles = {
    GUEST: 0,
    OPERATOR: 1,
    ADMIN: 2
};

const OrderStatus = {
    PENDING: 0,
    CONFIRMED: 1,
    ARCHIVED: 2,
    CANCELED: 3
};


var AgentRoutes = require('./routes/AgentRoute');
var OrderRoutes = require('./routes/OrderRoute');
var ProductRoutes = require('./routes/ProductRoute');

var ContentRoutes = require('./routes/ContentRoute');
var ConfigRoutes = require('./routes/ConfigRoute');

app.use('/agent', AgentRoutes);
app.use('/order', OrderRoutes);
app.use('/product', ProductRoutes);

app.use('/config', ConfigRoutes);

app.use('/', ContentRoutes);
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/assets', express.static(__dirname + '/public/assets'));


app.listen(80, () => {
    console.log('Server started on port 80');
});


