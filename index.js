const express=require('express');
const app=express();
const port=1000;
const path=require('path');
const cookieParser=require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const db=require('./config/mongoose');
//used for passportjs
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');
const session=require('express-session');
const MongoStore=require('connect-mongo')(session);

app.use(express.urlencoded());

//for cookies
app.use(cookieParser());

//for layouts 
app.use(express.static('./assets'))
app.use(expressLayouts);

//extract the styles
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

//router

//view engine setup
app.set('view engine','ejs');
app.set('views','./views');

app.use(session({
    name:'authentication',
    secret:'anything',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:1000*60*100
    },
    store: new MongoStore(
    {
        mongooseConnection:db,
        autoRemove:'disabled'
    },function(err){
        console.log(err || 'monfo store session cookie')
    }
    )
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);


app.use('/',require('./routes/index'));


app.listen(port,function(err){
    if(err){
        console.log('ERROR in running a server');
    }
    console.log('Server is running on port',port);
})