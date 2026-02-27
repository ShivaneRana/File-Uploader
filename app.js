const express = require('express');
const dotenv = require('dotenv').config({
    quiet:true,
    debug:false
});
const path = require('node:path');


const app = express();
app.set('view engine','ejs');
app.set('views',path.resolve(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));


app.get('/',(req,res) => {
    res.status(200).send("shivane sent this btw.");
})


const PORT = process.env.PORT || 3000;

app.listen(PORT,(err) => {
    if(err){
        console.error(err);
    }

    console.log(`http://localhost:${PORT}`)
})