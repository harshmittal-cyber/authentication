const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost/authentication');

const db=mongoose.connection;

db.on('error',console.error.bind(console,'Error connecting to MongoDB'));

db.once('open',function(){
    console.log('Connecting To database::MongoDB');
})

module.exports=db;