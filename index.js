const express=require('express');
const app=express();
const port=1000;
const path=require('path');




app.use('/',require('./routes/index'));

app.set('view engine','ejs');
app.set('views','./views')

app.listen(port,function(err){
    if(err){
        console.log('ERROR in running a server');
    }
    console.log('Server is running on port',port);
})