require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const expressLayout = require('express-ejs-layouts');
const connectDB = require('./server/db/db')
const cookieParser = require('cookie-parser');
const setUser = require('./middleware/setUser');
const panelProtected = require('./middleware/panelProtected');
const PORT = 3000 || process.env.PORT;

//connect database
connectDB();

app.set('view engine','ejs');
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname , 'public')));
app.use(expressLayout);
app.set('layout','./layouts/main')


app.use(setUser);

app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.adminEmail = process.env.ADMIN_EMAIL;
    next();
});

app.use('/',require('./server/routes/main'));
app.use('/',require('./server/routes/admin'));
 

app.listen(PORT,function(){
    console.log(`Server is running on port ${PORT}`);
});