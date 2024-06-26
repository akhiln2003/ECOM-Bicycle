const connectdb = require('./config/connectingDB');
const userRout = require('./routes/usersRoute');
const express = require('express');
const nocache = require('nocache');
const flash = require('express-flash');
const path = require('path');
const app = express();
const methodOverride = require('method-override')

connectdb.connectDB();

app.set('view engine', 'ejs')
app.use(methodOverride('_method'));
app.use(express.json());
app.use(nocache());
app.use(flash());




app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/assets')));



//For user rout
app.use('/', userRout);


const adminRoute = require('./routes/adminRoute');
app.use('/admin', adminRoute)

app.use('*',(req, res) => {
    res.status(404).render(path.join(__dirname, 'views/users/error404.ejs'));
    
})


app.listen(3000, () => {
    console.log("http://localhost:3000");
});