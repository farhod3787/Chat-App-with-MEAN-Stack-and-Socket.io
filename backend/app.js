const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config/config');

const routes = require('./routes');
const cors = require("cors");
const app = express();

app.use(cors());


// mongoose.connect( config.CLOUD_URL, { useNewUrlParser: true })
//     .then(() => {
//         console.log('Cloud MongoDb connected.');
//     })
//     .catch(err => console.log(err));

mongoose.connect(
  config.MONGO_URL
  ).then( () => {
    console.log('Connected to local database')
})
.catch( () =>{
    console.log('Error in connected database')
});



module.exports = { mongoose };


// app.use(express.bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/images', express.static(path.join("backend/images")));


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Request-Width, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next()
});

app.use('/api', routes.api);


module.exports = app;
