
const express = require('express');
const user_route = express();

const userController = require("../controller/userController")
  

user_route.set('view engine', 'ejs')
user_route.set('views','./views/users')

user_route.get('/register', userController.loadRegister);

user_route.get('/login',userController.loadLogin);

user_route.get('/',userController.loadHome)




module.exports = user_route;